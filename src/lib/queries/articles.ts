import { graphql } from "@/gql"

export const getArticlesQuantityQuery = graphql(`
  query getArticlesQuantity($locales: [Locale!]!) {
    articlesConnection(locales: $locales) {
      aggregate {
        count
      }
    }
  }
`)

export const listArticlesForSitemapQuery = graphql(`
  query listArticlesForSitemap($locales: [Locale!]!, $skip: Int = 0, $first: Int = 50) {
    articles(locales: $locales, skip: $skip, first: $first, orderBy: updatedAt_ASC) {
      slug
      updatedAt
      image {
        data {
          url
        }
      }
    }
  }
`)

export const getRecentArticlesQuery = graphql(`
  query getRecentArticles($locales: [Locale!]!, $skip: Int = 0, $first: Int = 50, $where: ArticleWhereInput) {
    articles(locales: $locales, skip: $skip, first: $first, orderBy: publishedAt_DESC, where: $where) {
      id
      author {
        name
      }
      publishedAt
      locale
      slug
      title
      tags
      image {
        description {
          text
        }
        data {
          url
        }
      }
    }
    articlesConnection(locales: $locales) {
      aggregate {
        count
      }
    }
  }
`)

export const getArticleBySlugQuery = graphql(`
  query getArticleBySlug($locales: [Locale!]!, $slug: String!) {
    articles(locales: $locales, where: { slug: $slug }) {
      id
      title
      image(forceParentLocale: true) {
        id
        description {
          text
        }
        data {
          url
        }
      }
      author {
        id
        name
      }
      content {
        raw
      }
      recommendedArticles {
        title
        slug
        id
        image {
          description {
            text
          }
          data {
            url
          }
        }
      }
      categories {
        title
        slug
      }
    }
  }
`)

export const getArticleMetadataBySlugQuery = graphql(`
  query getArticleMetadataBySlugQuery($locales: [Locale!]!, $slug: String!) {
    articles(locales: $locales, where: { slug: $slug }) {
      seoComponent {
        title
        description {
          text
        }
      }
      image {
        data {
          url
        }
        title
        description {
          text
        }
      }
      author {
        name
      }
    }
  }
`)

export const listArticlesBySlugQuery = graphql(`
  query listArticlesBySlug($locales: [Locale!]!, $slugs: [String!]!) {
    articles(locales: $locales, where: { slug_in: $slugs }) {
      id
      title
      slug
      publishedAt
      image(forceParentLocale: true) {
        id
        description {
          text
        }
        data {
          url
        }
      }
      author {
        id
        name
      }
      tags
    }
  }
`)

export const listArticlesByCategoryQuery = graphql(`
  query listArticlesByCategory($locales: [Locale!]!, $categorySlug: String!, $skip: Int = 0, $first: Int = 50) {
    articles(
      locales: $locales
      where: { categories_some: { slug: $categorySlug } }
      skip: $skip
      first: $first
      orderBy: publishedAt_DESC
    ) {
      image {
        description {
          text
        }
        data {
          url
        }
      }
      slug
      title
    }
    articlesConnection(locales: $locales) {
      aggregate {
        count
      }
    }
  }
`)
