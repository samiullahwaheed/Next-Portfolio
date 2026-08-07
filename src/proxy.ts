import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyAdminToken } from '@/lib/auth'

export function proxy(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value
  const session = token ? verifyAdminToken(token) : null

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
