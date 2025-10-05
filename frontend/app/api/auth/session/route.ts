import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ user: null })
    }
    
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')
      const { payload } = await jwtVerify(token, secret)
      
      return NextResponse.json({ 
        user: {
          id: payload.id as string,
          email: payload.email as string,
          name: payload.name as string,
          role: payload.role as string
        }
      })
    } catch (error) {
      return NextResponse.json({ user: null })
    }
    
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
