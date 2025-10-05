import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Remove adapter when using JWT strategy with credentials
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 Authorize called with:', { email: credentials?.email, hasPassword: !!credentials?.password })
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          console.log('🔍 Attempting to find user:', credentials.email)
          
          // Check if database is available
          if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
            console.error('❌ No database URL found')
            return null
          }

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('👤 User found:', user ? 'Yes' : 'No')

          if (!user) {
            console.log('❌ User not found')
            return null
          }

          if (!user.hashedPassword) {
            console.log('❌ No password hash found')
            return null
          }

          // Verify password
          console.log('🔐 Verifying password...')
          const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
          
          console.log('🔐 Password valid:', isValidPassword)

          if (!isValidPassword) {
            console.log('❌ Invalid password')
            return null
          }

          console.log('✅ Authentication successful for:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  useSecureCookies: false,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  }
}
