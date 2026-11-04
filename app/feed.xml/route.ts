import { buildFeedXml } from '~/lib/feeds'

export async function GET(): Promise<Response> {
  const xml = buildFeedXml()

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
