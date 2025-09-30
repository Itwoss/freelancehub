import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FreelanceHub - Premium Digital Products & Services',
  description: 'Discover amazing digital products, templates, and services. Connect with talented freelancers and find your next project.',
  keywords: ['freelance', 'marketplace', 'digital products', 'templates', 'design', 'development', 'freelancers', 'clients'],
  authors: [{ name: 'FreelanceHub Team' }],
  openGraph: {
    title: 'FreelanceHub - Premium Digital Products & Services',
    description: 'Discover amazing digital products, templates, and services.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreelanceHub - Premium Digital Products & Services',
    description: 'Discover amazing digital products, templates, and services.',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
