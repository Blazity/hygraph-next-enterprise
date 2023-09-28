import { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { print } from "graphql"
import omit from "lodash/omit"
import { env } from "@/env.mjs"
import { Locale, standardNotationToHygraphLocale } from "@/i18n/i18n"
import {
  getArticleBySlugQuery,
  getArticleMetadataBySlugQuery,
  getArticlesQuantityQuery,
  getRecentArticlesQuery,
  listArticlesBySlugQuery,
  listArticlesForSitemapQuery,
} from "./queries/articles"
import { getFooterQuery, getHomepageMetadataQuery, getHomepageQuery, getNavigationQuery } from "./queries/components"
import { getPageBySlugQuery, getPageMetadataBySlugQuery, listPagesForSitemapQuery } from "./queries/pages"
import { Tag } from "./tags"

export async function graphqlFetch<TQuery, TVariables>({
  cache = "force-cache",
  headers,
  document,
  variables,
  revalidate,
  tags,
}: {
  cache?: RequestCache
  revalidate?: number
  headers?: HeadersInit
  document: TypedDocumentNode<TQuery, TVariables>
  variables?: Omit<TVariables, "locales"> & { locale?: Locale }
  tags?: Tag[]
}): Promise<TQuery> {
  const variablesWithoutLocale = omit(variables, "locale")
  const localeFromVariables = variables?.locale

  const result = await fetch(env.NEXT_PUBLIC_HYGRAPH_CONTENT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({
      query: print(document),
      ...(variables && {
        variables: {
          ...(localeFromVariables && { locales: [standardNotationToHygraphLocale(localeFromVariables)] }),
          ...variablesWithoutLocale,
        },
      }),
    }),
    ...(!revalidate && { cache }),
    ...((tags || revalidate) && { next: { ...(tags && { tags }), ...(revalidate && { revalidate }) } }),
  })

  const parsed = (await result.json()) as { data: TQuery }
  console.log(parsed)
  return parsed.data
}

export async function getFooter(locale: Locale) {
  const { footers } = await graphqlFetch({
    cache: "force-cache",
    document: getFooterQuery,
    tags: ["FOOTER", "PAGE"],
    variables: { locale },
  })
  return footers[0] ?? null
}

export async function getHomepage(locale: Locale) {
  const { homepages } = await graphqlFetch({
    document: getHomepageQuery,
    tags: ["HOMEPAGE", "CATEGORY", "ARTICLE"],
    revalidate: 60 * 60 * 12, // 12h
    variables: { locale },
  })
  return homepages[0] ?? null
}

export async function getHomepageMetadata(locale: Locale) {
  const { homepages } = await graphqlFetch({
    cache: "force-cache",
    document: getHomepageMetadataQuery,
    tags: ["HOMEPAGE", "CATEGORY", "ARTICLE"],
    variables: { locale },
  })
  return homepages[0] ?? null
}

export async function getNavigation(locale: Locale) {
  const { navigations } = await graphqlFetch({
    cache: "force-cache",
    document: getNavigationQuery,
    tags: ["NAVIGATION", "PAGE"],
    variables: { locale },
  })

  return navigations[0] ?? null
}

export async function getArticlesQuantity(locale: Locale) {
  const { articlesConnection } = await graphqlFetch({
    cache: "force-cache",
    document: getArticlesQuantityQuery,
    tags: ["ARTICLE"],
    variables: { locale },
  })
  return articlesConnection.aggregate.count ?? 0
}

export async function listArticlesForSitemap(variables: { locale: Locale; skip?: number; first?: number }) {
  const { articles } = await graphqlFetch({
    cache: "force-cache",
    document: listArticlesForSitemapQuery,
    tags: ["ARTICLE"],
    variables,
  })
  return articles
}

export async function getRecentArticles(variables: { locale: Locale; skip?: number; first?: number }) {
  const { articles, articlesConnection } = await graphqlFetch({
    cache: "force-cache",
    document: getRecentArticlesQuery,
    tags: ["ARTICLE"],
    variables,
  })
  return { articles, count: articlesConnection.aggregate.count }
}

export async function getArticleBySlug(variables: { locale: Locale; slug: string }) {
  const { articles } = await graphqlFetch({
    cache: "force-cache",
    document: getArticleBySlugQuery,
    tags: ["ARTICLE"],
    variables,
  })
  return articles[0] ?? null
}

export async function getArticleMetadataBySlug(variables: { locale: Locale; slug: string }) {
  const { articles } = await graphqlFetch({
    cache: "force-cache",
    document: getArticleMetadataBySlugQuery,
    tags: ["ARTICLE"],
    variables,
  })
  return articles[0] ?? null
}

export async function getPageBySlug(variables: { locale: Locale; slug: string }) {
  const { pages } = await graphqlFetch({
    cache: "force-cache",
    document: getPageBySlugQuery,
    tags: ["PAGE"],
    variables,
  })
  return pages[0] ?? null
}

export async function getPageMetadataBySlug(variables: { locale: Locale; slug: string }) {
  const { pages } = await graphqlFetch({
    cache: "force-cache",
    document: getPageMetadataBySlugQuery,
    tags: ["PAGE"],
    variables,
  })
  return pages[0] ?? null
}

export async function listPagesForSitemap(locale: Locale) {
  const { pages } = await graphqlFetch({
    cache: "force-cache",
    document: listPagesForSitemapQuery,
    tags: ["PAGE"],
    variables: { locale },
  })
  return pages
}

export async function listArticlesBySlugs(variables: { locale: Locale; slugs: string[] }) {
  const { articles } = await graphqlFetch({
    cache: "force-cache",
    document: listArticlesBySlugQuery,
    tags: ["ARTICLE"],
    variables,
  })
  return articles
}
