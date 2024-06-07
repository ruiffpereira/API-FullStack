const BASE_URL = process.env.API_BASE_URL

export const getAllOrderProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/orderproducts`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching order products:', error)
    throw new Error('An error occurred while fetching order products')
  }
}

export const createOrderProduct = async (orderProductData) => {
  try {
    const response = await fetch(`${BASE_URL}/orderproducts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderProductData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating order product:', error)
    throw new Error('An error occurred while creating order product')
  }
}

export const getOrderProductById = async (orderProductId) => {
  try {
    const response = await fetch(`${BASE_URL}/orderproducts/${orderProductId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching order product:', error)
    throw new Error('An error occurred while fetching order product')
  }
}

// Função para atualizar uma associação entre pedido e produto
export const updateOrderProduct = async (orderProductId, orderProductData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/orderproducts/${orderProductId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderProductData),
      },
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating order product:', error)
    throw new Error('An error occurred while updating order product')
  }
}

// Função para apagar uma associação entre pedido e produto
export const deleteOrderProduct = async (orderProductId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/orderproducts/${orderProductId}`,
      {
        method: 'DELETE',
      },
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting order product:', error)
    throw new Error('An error occurred while deleting order product')
  }
}
