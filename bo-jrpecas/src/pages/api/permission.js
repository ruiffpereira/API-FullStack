const BASE_URL = process.env.API_BASE_URL

export const getAllPermissions = async () => {
  try {
    const response = await fetch(`${BASE_URL}/permissions`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching permissions:', error)
    throw new Error('An error occurred while fetching permissions')
  }
}

export const createPermission = async (permissionData) => {
  try {
    const response = await fetch(`${BASE_URL}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permissionData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating permission:', error)
    throw new Error('An error occurred while creating permission')
  }
}

export const getPermissionById = async (permissionId) => {
  try {
    const response = await fetch(`${BASE_URL}/permissions/${permissionId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching permission:', error)
    throw new Error('An error occurred while fetching permission')
  }
}

// Função para atualizar uma permissão
export const updatePermission = async (permissionId, permissionData) => {
  try {
    const response = await fetch(`${BASE_URL}/permissions/${permissionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(permissionData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating permission:', error)
    throw new Error('An error occurred while updating permission')
  }
}

// Função para apagar uma permissão
export const deletePermission = async (permissionId) => {
  try {
    const response = await fetch(`${BASE_URL}/permissions/${permissionId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting permission:', error)
    throw new Error('An error occurred while deleting permission')
  }
}
