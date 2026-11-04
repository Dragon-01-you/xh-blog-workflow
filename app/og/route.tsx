import { ImageResponse } from 'next/og'
import { brandConfig } from '~/lib/personal'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || brandConfig.name
  const description = searchParams.get('description') || brandConfig.tagline

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#fcfbf9',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: '#0f172a',
          border: '12px solid #0f172a',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: '#c53929',
              borderRadius: 2,
            }}
          />
          <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2 }}>
            {brandConfig.name} · {brandConfig.enName}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h1 style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15, margin: 0 }}>
            {title}
          </h1>
          <p style={{ fontSize: 28, color: '#64748b', margin: 0, maxWidth: 900 }}>
            {description}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '2px solid #e2e8f0',
            paddingTop: 24,
            fontSize: 20,
            color: '#94a3b8',
          }}
        >
          <span>Swiss Paper &amp; Ink Design System</span>
          <span>xinhuo.ai</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
