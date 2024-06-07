const BASE_URL = process.env.API_BASE_URL

export const getAllSubcategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    throw new Error('An error occurred while fetching subcategories')
  }
}

export const createSubcategory = async (subcategoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subcategoryData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating subcategory:', error)
    throw new Error('An error occurred while creating subcategory')
  }
}

export const getSubcategoryById = async (subcategoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories/${subcategoryId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching subcategory:', error)
    throw new Error('An error occurred while fetching subcategory')
  }
}

// Função para atualizar uma subcategoria
export const updateSubcategory = async (subcategoryId, subcategoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories/${subcategoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subcategoryData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating subcategory:', error)
    throw new Error('An error occurred while updating subcategory')
  }
}

// Função para apagar uma subcategoria
export const deleteSubcategory = async (subcategoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/subcategories/${subcategoryId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    throw new Error('An error occurred while deleting subcategory')
  }
}
