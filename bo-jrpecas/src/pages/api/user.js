const BASE_URL = process.env.API_BASE_URL

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('An error occurred while fetching users')
  }
}

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('An error occurred while creating user')
  }
}

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('An error occurred while fetching user')
  }
}

// Função para atualizar um usuário
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('An error occurred while updating user')
  }
}

// Função para apagar um usuário
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error('An error occurred while deleting user')
  }
}
