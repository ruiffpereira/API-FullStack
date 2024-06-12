// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { verifyPassword } from '@/../lib/auth'
import { findUserByEmail } from '@/../lib/user'

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const user = await findUserByEmail(credentials.email)

        if (
          user &&
          (await verifyPassword(credentials.password, user.password))
        ) {
          return { id: user.id, email: user.email, name: user.name }
        } else {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session(session, token) {
      session.user.id = token.id
      return session
    },
  },
  secret: process.env.SECRET,
})
