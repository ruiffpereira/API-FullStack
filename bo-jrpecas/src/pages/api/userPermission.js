export const assignPermissionToUser = async (userId, permissionId) => {
  try {
    // Aqui você faria a lógica para associar a permissão ao usuário no backend
    console.log(`Permission ${permissionId} assigned to user ${userId}`)
    return true
  } catch (error) {
    console.error('Error assigning permission to user:', error)
    throw new Error('An error occurred while assigning permission to user')
  }
}

export const removePermissionFromUser = async (userId, permissionId) => {
  try {
    // Aqui você faria a lógica para remover a permissão do usuário no backend
    console.log(`Permission ${permissionId} removed from user ${userId}`)
    return true
  } catch (error) {
    console.error('Error removing permission from user:', error)
    throw new Error('An error occurred while removing permission from user')
  }
}
