import { RecentArticles } from "@/components/RecentArticles/RecentArticles"
import { StockDisplay } from "@/components/StockDisplay/StockDisplay"
import { TrendingArticles } from "@/components/TrendingArticles/TrendingArticles"
import { Locale } from "@/i18n/i18n"

export const metadata = {
  title: "Blazity-Hygraph news starter",
  openGraph: {
    url: "https://next-enterprise.vercel.app/",
    images: [
      {
        url: "https://raw.githubusercontent.com/Blazity/next-enterprise/main/project-logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default async function Web({ params }: { params: { lang: Locale } }) {
  return (
    <>
      <div className="flex w-full justify-end px-4 pt-4">
        <StockDisplay />
      </div>
      <div className="flex flex-col gap-16">
      <TrendingArticles lang={params.lang} />
      <RecentArticles lang={params.lang} /></div>
    </>
  )
}
