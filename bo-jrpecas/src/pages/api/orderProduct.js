const BASE_URL = process.env.API_BASE_URL

export const getOrderProductById = async (orderProductId) => {
  try {
    const response = await fetch(`${BASE_URL}/ordersProduct/${orderProductId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching order product:', error)
    throw new Error('An error occurred while fetching order product')
  }
}

export const getOrderProductByOrderId = async (orderProductId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/ordersProduct/orderid/${orderProductId}`,
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching order product:', error)
    throw new Error('An error occurred while fetching order product')
  }
}
