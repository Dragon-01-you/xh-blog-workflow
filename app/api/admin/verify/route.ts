import { NextResponse } from 'next/server'
import { createHmac, randomBytes } from 'crypto'

function getSecretKey(): string | null {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret || secret.trim().length === 0) {
    return null
  }
  return secret.trim()
}

function generateSessionToken(secret: string): string {
  const timestamp = Date.now().toString()
  const nonce = randomBytes(16).toString('hex')
  const payload = `${timestamp}:${nonce}`
  const signature = createHmac('sha256', secret).update(payload).digest('hex')
  return `${timestamp}.${nonce}.${signature}`
}

function verifySessionToken(token: string | undefined | null, secret: string): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [timestamp, nonce, signature] = parts
  const age = Date.now() - parseInt(timestamp, 10)
  // Max age: 24 hours (86,400,000 ms)
  if (isNaN(age) || age < 0 || age > 86400000) return false
  const payload = `${timestamp}:${nonce}`
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex')
  return signature === expectedSig
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  const map: Record<string, string> = {}
  if (!cookieHeader) return map
  const pairs = cookieHeader.split(';')
  for (const pair of pairs) {
    const idx = pair.indexOf('=')
    if (idx > -1) {
      const key = pair.slice(0, idx).trim()
      const val = pair.slice(idx + 1).trim()
      map[key] = decodeURIComponent(val)
    }
  }
  return map
}

export async function GET(request: Request) {
  const secret = getSecretKey()
  if (!secret) {
    return NextResponse.json(
      { authenticated: false, unconfigured: true, error: 'ADMIN_PASSWORD not set in environment.' },
      { status: 403 }
    )
  }

  const cookieHeader = request.headers.get('cookie')
  const cookies = parseCookies(cookieHeader)
  const token = cookies['xh_admin_session']

  const isValid = verifySessionToken(token, secret)
  return NextResponse.json({ authenticated: isValid })
}

export async function POST(request: Request) {
  try {
    const secret = getSecretKey()
    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          error: '管理员口令未在服务端环境变量 ADMIN_PASSWORD 中配置，后台已锁定。请在 .env.local 中配置后重试。',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { passcode } = body

    if (typeof passcode === 'string' && passcode.trim() === secret) {
      const token = generateSessionToken(secret)
      const response = NextResponse.json({ success: true })
      
      response.cookies.set('xh_admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      })
      return response
    }

    return NextResponse.json(
      { success: false, error: '口令不正确，访问被拒绝。' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: '请求解析失败。' },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: '已退出登录' })
  response.cookies.set('xh_admin_session', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  })
  return response
}
