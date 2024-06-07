const BASE_URL = process.env.API_BASE_URL

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`)
    const data = await response.json()
    return JSON.stringify(data)
  } catch (error) {
    console.error('Error fetching products:', error)
    throw new Error('An error occurred while fetching products')
  }
}

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('An error occurred while creating product')
  }
}

export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw new Error('An error occurred while fetching product')
  }
}

// Função para atualizar um produto
export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating product:', error)
    throw new Error('An error occurred while updating product')
  }
}

// Função para apagar um produto
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('An error occurred while deleting product')
  }
}
