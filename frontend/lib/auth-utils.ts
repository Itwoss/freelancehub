import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextRequest } from 'next/server'

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return {
        user: null,
        error: 'Not authenticated'
      }
    }
    
    return {
      user: session.user,
      error: null
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return {
      user: null,
      error: 'Authentication failed'
    }
  }
}

export function createAuthResponse(message: string, status: number = 401) {
  return new Response(
    JSON.stringify({ 
      error: message,
      authenticated: false 
    }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}
