import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { GET, POST, DELETE } from '~/app/api/admin/verify/route'

describe('Admin Verify Server API (/api/admin/verify)', () => {
  const originalEnv = process.env.ADMIN_PASSWORD

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'test_secure_password_2026'
  })

  afterEach(() => {
    process.env.ADMIN_PASSWORD = originalEnv
  })

  it('fails closed (500) if ADMIN_PASSWORD is unset or empty', async () => {
    delete process.env.ADMIN_PASSWORD

    const req = new Request('http://localhost:3000/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'test_secure_password_2026' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('未在服务端环境变量 ADMIN_PASSWORD 中配置')
  })

  it('returns 401 on incorrect passcode', async () => {
    const req = new Request('http://localhost:3000/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'wrong_code' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 200 and issues HMAC signed session cookie on correct passcode', async () => {
    const req = new Request('http://localhost:3000/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode: 'test_secure_password_2026' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)

    // Verify Set-Cookie header contains xh_admin_session with signed 3-part token
    const cookieHeader = res.headers.get('set-cookie')
    expect(cookieHeader).toContain('xh_admin_session=')
    expect(cookieHeader).toContain('HttpOnly')

    const tokenMatch = cookieHeader?.match(/xh_admin_session=([^;]+)/)
    expect(tokenMatch).toBeTruthy()
    const token = tokenMatch![1]
    const parts = token.split('.')
    expect(parts.length).toBe(3) // timestamp.nonce.signature

    // Verify GET /api/admin/verify successfully validates the signed cookie
    const getReq = new Request('http://localhost:3000/api/admin/verify', {
      method: 'GET',
      headers: { Cookie: `xh_admin_session=${token}` },
    })
    const getRes = await GET(getReq)
    expect(getRes.status).toBe(200)
    const getJson = await getRes.json()
    expect(getJson.authenticated).toBe(true)
  })

  it('rejects forged or tampered session token on GET', async () => {
    const forgedReq = new Request('http://localhost:3000/api/admin/verify', {
      method: 'GET',
      headers: { Cookie: 'xh_admin_session=authenticated' },
    })
    const forgedRes = await GET(forgedReq)
    expect(forgedRes.status).toBe(200)
    const forgedJson = await forgedRes.json()
    expect(forgedJson.authenticated).toBe(false)
  })

  it('DELETE revokes session cookie', async () => {
    const delRes = await DELETE()
    expect(delRes.status).toBe(200)
    const cookieHeader = delRes.headers.get('set-cookie')
    expect(cookieHeader).toContain('xh_admin_session=;')
    expect(cookieHeader).toContain('Max-Age=0')
  })
})
