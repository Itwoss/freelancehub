import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

    // If accessing admin routes but not admin user
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // If admin user accessing dashboard, redirect to admin dashboard
    if (isAdmin && req.nextUrl.pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    
    // If regular user accessing dashboard, allow access
    if (!isAdmin && req.nextUrl.pathname === '/dashboard') {
      return NextResponse.next()
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
        
        // Allow access to admin login page without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        
        // For other admin routes, require authentication
        if (isAdminRoute) {
          return !!token
        }
        
        // For other routes, allow access
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/users',
    '/admin/projects',
    '/admin/orders',
    '/admin/analytics',
    '/admin/reports',
    '/admin/settings',
    '/dashboard',
  ]
}
