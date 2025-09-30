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
        console.log('🔐 NextAuth authorize called with:', { 
          email: credentials?.email, 
          hasPassword: !!credentials?.password 
        })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          console.log('📧 Looking up user in database...')
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) {
            console.log('❌ User not found:', credentials.email)
            return null
          }

          console.log('✅ User found:', { 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            role: user.role,
            hasPassword: !!user.password 
          })

          if (!user.password) {
            console.log('❌ User has no password set')
            return null
          }

          console.log('🔐 Verifying password...')
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', credentials.email)
            return null
          }

          console.log('✅ Authentication successful for user:', user.email)
          const authResult = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
          console.log('✅ Returning auth result:', authResult)
          return authResult
        } catch (error) {
          console.error('❌ Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('🔄 JWT callback called:', { 
        hasUser: !!user, 
        hasToken: !!token,
        userRole: user?.role,
        tokenRole: token?.role 
      })
      if (user) {
        token.role = user.role
        token.id = user.id
        console.log('✅ JWT token updated with user data:', { role: user.role, id: user.id })
      }
      return token
    },
    async session({ session, token }) {
      console.log('🔄 Session callback called:', { 
        hasSession: !!session, 
        hasToken: !!token,
        tokenRole: token?.role,
        tokenId: token?.id 
      })
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        console.log('✅ Session updated with token data:', { 
          id: session.user.id, 
          role: session.user.role 
        })
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development'
}
