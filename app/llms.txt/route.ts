import { buildLlmsText } from '~/lib/llms'

export async function GET(): Promise<Response> {
  const content = buildLlmsText()

  return new Response(content, {
    status: 200,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
