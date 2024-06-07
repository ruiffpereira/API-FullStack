const BASE_URL = process.env.API_BASE_URL

export const getAllCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('An error occurred while fetching categories')
  }
}

export const createCategory = async (categoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating category:', error)
    throw new Error('An error occurred while creating category')
  }
}

export const getCategoryById = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching category:', error)
    throw new Error('An error occurred while fetching category')
  }
}

// Função para atualizar uma categoria
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating category:', error)
    throw new Error('An error occurred while updating category')
  }
}

// Função para apagar uma categoria
export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error('An error occurred while deleting category')
  }
}
