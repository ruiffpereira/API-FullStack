const BASE_URL = process.env.API_BASE_URL

export const getAllCustomers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/customers`)
    const data = await response.json()
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    console.log(JSON.stringify(data))
    return JSON.stringify(data)
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw new Error('An error occurred while fetching customers')
  }
}

export const createCustomer = async (customerData) => {
  try {
    const response = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating customer:', error)
    throw new Error('An error occurred while creating customer')
  }
}

export const getCustomerById = async (customerId) => {
  try {
    const response = await fetch(`${BASE_URL}/customers/${customerId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw new Error('An error occurred while fetching customer')
  }
}

// Função para atualizar um cliente
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error updating customer:', error)
    throw new Error('An error occurred while updating customer')
  }
}

// Função para apagar um cliente
export const deleteCustomer = async (customerId) => {
  try {
    const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw new Error('An error occurred while deleting customer')
  }
}
