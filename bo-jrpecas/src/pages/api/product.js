const BASE_URL = process.env.API_BASE_URL

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products`)
    const data = await response.json()
    return data
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

export default async function updateProduct(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const { id, name } = req.body

  // Aqui você faria a lógica para atualizar o produto no banco de dados
  try {
    await fetch(`${BASE_URL}/subcategories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, name }),
    })

    res.status(200).json({ message: 'Produto atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error)
    res.status(500).json({ error: 'Erro ao atualizar o produto' })
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
