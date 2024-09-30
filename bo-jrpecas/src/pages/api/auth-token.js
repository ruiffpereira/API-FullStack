export const fetchWithAuth = async (url, token, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return response
}
