import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'admin_token'

export type AdminTokenPayload = {
  email: string
}

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing JWT_SECRET environment variable')
  return secret
}

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' })
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, getSecret()) as AdminTokenPayload
  } catch {
    return null
  }
}

/** Reads and verifies the admin session cookie inside a Route Handler. Returns null when unauthenticated. */
export async function requireAdmin(): Promise<AdminTokenPayload | null> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}
