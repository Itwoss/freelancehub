import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 AUTH: Authorize called with:', { 
          email: credentials?.email, 
          hasPassword: !!credentials?.password 
        })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ AUTH: Missing credentials')
          return null
        }

        try {
          console.log('🔍 AUTH: Looking for user:', credentials.email)
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          console.log('👤 AUTH: User found:', user ? 'Yes' : 'No')

          if (!user) {
            console.log('❌ AUTH: User not found')
            return null
          }

          if (!user.hashedPassword) {
            console.log('❌ AUTH: No password hash')
            return null
          }

          console.log('🔐 AUTH: Verifying password...')
          const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword)
          
          console.log('🔐 AUTH: Password valid:', isValidPassword)

          if (!isValidPassword) {
            console.log('❌ AUTH: Invalid password')
            return null
          }

          console.log('✅ AUTH: Authentication successful for:', user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error('❌ AUTH: Error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
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
    }
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET
}