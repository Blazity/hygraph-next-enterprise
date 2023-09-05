import { NextRequest, NextResponse } from "next/server"
import { pipe } from "utils/pipe"
import { z } from "zod"
import { algoliaClient } from "../algoliaClient"
import { errorToNextResponse } from "../httpError"
import { NextRequestWithValidBody, validateBody } from "../validateBody"
import { validateSignature } from "../validateSignature"

async function handleAlgoliaUnpublishWebhook(req: NextRequestWithValidBody<z.infer<typeof bodySchema>>) {
  const article = req.validBody.data

  const indexingResults = await Promise.allSettled(
    article.localizations.map(async ({ locale }) => {
      const index = algoliaClient.initIndex(`articles-${locale}`)
      await index.deleteObject(article.id)

      return { locale }
    })
  )

  return NextResponse.json({ result: indexingResults }, { status: 201 })
}

export async function POST(req: NextRequest) {
  try {
    return await pipe(req, validateSignature, validateBody(bodySchema), handleAlgoliaUnpublishWebhook)
  } catch (error) {
    return errorToNextResponse(error)
  }
}

const bodySchema = z.object({
  data: z.object({
    localizations: z.array(z.object({ locale: z.string() })),
    id: z.string(),
  }),
})
