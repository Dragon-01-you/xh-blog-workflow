import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { passcode } = body

    // Server-side check only: Never exposed to client bundle via NEXT_PUBLIC_
    const serverPasscode = process.env.ADMIN_PASSWORD || 'xinhuo2026'

    if (typeof passcode === 'string' && passcode.trim() === serverPasscode) {
      const response = NextResponse.json({ success: true })
      // Set secure HTTP-only cookie for session verification
      response.cookies.set('xh_admin_session', 'authenticated', {
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
