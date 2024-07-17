// checkSession.js
import { getSession } from 'next-auth/react'

export async function checkSession(req) {
  const session = await getSession({ req })
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    }
  }
  return null
}

export async function checkSessionOnLogin(req) {
  const session = await getSession({ req })
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }
  return null
}
