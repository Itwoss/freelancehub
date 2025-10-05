import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isDashboardRoute = pathname === '/dashboard'
  
  // Allow access to admin login page without authentication
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }
  
  // For protected routes, check authentication
  if (isAdminRoute || isDashboardRoute) {
    const token = req.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
      const { payload } = await jwtVerify(token, secret)
      const isAdmin = payload.role === 'ADMIN'
      
      // If accessing admin routes but not admin user
      if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL('/auth/signin', req.url))
      }
      
      // If admin user accessing dashboard, redirect to admin dashboard
      if (isAdmin && isDashboardRoute) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      }
      
      return NextResponse.next()
    } catch (error) {
      console.error('JWT verification error:', error)
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Only protect admin routes for now
    '/admin/dashboard',
    '/admin/users',
    '/admin/projects',
    '/admin/orders',
    '/admin/analytics',
    '/admin/reports',
    '/admin/settings',
    // '/dashboard', // Let dashboard handle its own auth
  ]
}
