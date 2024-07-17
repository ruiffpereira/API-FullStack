// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g., 'Sign in with...')
      name: 'credentials',
      // The credentials property is used to generate a form on the sign-in page.
      credentials: {
        email: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // You need to provide your own logic here to find the user from your database
        const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }

        if (
          credentials.email === 'user' &&
          credentials.password === 'password'
        ) {
          const token = jwt.sign(
            { id: user.id, email: user.email },
            'your_secret_key',
            { expiresIn: '1h' },
          )
          // If the user is authenticated, return the user object
          return { user, token }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also reject this callback with an error and the user will see an error page.
          // throw new Error('Invalid credentials')
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true, // Opcional, dependendo da versão do NextAuth.js
  },
  callbacks: {
    async jwt(token, user) {
      if (user?.token) {
        token.accessToken = user.token
      }
      return token
    },
    async session(session, token) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    },
  },
})
