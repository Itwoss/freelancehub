'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Auth error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-red-500 mb-4">Auth Error</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">Authentication Failed</h2>
          <p className="text-gray-400">
            We encountered an error during authentication. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={reset}
            className="w-full bg-orange-500 hover:bg-orange-600 mb-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/auth/signin'}
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If this problem persists, please check your credentials.</p>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-gray-400">Error Details</summary>
              <pre className="mt-2 text-xs text-gray-500 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
