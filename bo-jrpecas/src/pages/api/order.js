const BASE_URL = process.env.API_BASE_URL

export const getAllOrders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/orders`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw new Error('An error occurred while fetching orders')
  }
}

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating order:', error)
    throw new Error('An error occurred while creating order')
  }
}

export const getOrderById = async (orderId) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('An error occurred while fetching order')
  }
}

export const getOrderCustomerId = async (orderId) => {
  try {
    console.log(orderId)
    const response = await fetch(`${BASE_URL}/orders/customerid/${orderId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching order:', error)
    throw new Error('An error occurred while fetching order')
  }
}

// Função para atualizar um pedido
export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating order:', error)
    throw new Error('An error occurred while updating order')
  }
}

// Função para apagar um pedido
export const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting order:', error)
    throw new Error('An error occurred while deleting order')
  }
}
