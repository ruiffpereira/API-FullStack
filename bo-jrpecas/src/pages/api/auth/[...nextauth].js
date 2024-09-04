import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'

const BASE_URL = process.env.API_BASE_URL

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          })
          console.log(credentials.username)
          const user = await res.json()
          console.log(user)

          if (res.ok && user) {
            const token = jwt.sign(
              { username: user.username },
              process.env.JWT_SECRET,
              { expiresIn: '1h' },
            )
            return { ...user, token }
          } else {
            return null
          }
        } catch (error) {
          console.error(error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.username = user.username
        token.accessToken = user.token
      }
      return token
    },
    async session(session, token) {
      session.user.username = token.username
      session.accessToken = token.accessToken
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
})
