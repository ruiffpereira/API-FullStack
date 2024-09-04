// import React, { useState } from 'react'

// function RegisterForm() {
//   const [users, setUsers] = useState([
//     { id: 1, username: 'usuario1', role: 'admin' },
//     { id: 2, username: 'usuario2', role: 'user' },
//     // Adicione mais usuários conforme necessário
//   ])
//   const [formData, setFormData] = useState({
//     id: null, // Para edição de usuários
//     username: '',
//     password: '',
//     confirmPassword: '',
//     role: 'user', // Valor padrão
//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (formData.password !== formData.confirmPassword) {
//       alert('As senhas não coincidem!')
//       return
//     }
//     if (formData.id) {
//       // Edição de usuário
//       const updatedUsers = users.map((user) =>
//         user.id === formData.id
//           ? { ...user, username: formData.username, role: formData.role }
//           : user,
//       )
//       setUsers(updatedUsers)
//     } else {
//       // Adição de novo usuário
//       const newUser = {
//         id: Math.max(...users.map((user) => user.id)) + 1, // Gera um novo ID
//         username: formData.username,
//         role: formData.role,
//       }
//       setUsers([...users, newUser])
//     }
//     // Limpar o formulário
//     setFormData({
//       username: '',
//       password: '',
//       confirmPassword: '',
//       role: 'user',
//       id: null,
//     })
//   }

//   const handleEdit = (user) => {
//     setFormData({ ...user, password: '', confirmPassword: '' })
//   }

//   const handleDelete = (userId) => {
//     setUsers(users.filter((user) => user.id !== userId))
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         name="username"
//         value={formData.username}
//         onChange={handleChange}
//         placeholder="Username"
//       />
//       <input
//         type="password"
//         name="password"
//         value={formData.password}
//         onChange={handleChange}
//         placeholder="Password"
//       />
//       <input
//         type="password"
//         name="confirmPassword"
//         value={formData.confirmPassword}
//         onChange={handleChange}
//         placeholder="Confirm Password"
//       />
//       <select name="role" value={formData.role} onChange={handleChange}>
//         <option value="user">User</option>
//         <option value="admin">Admin</option>
//       </select>
//       <button type="submit">Salvar</button>
//     </form>
//     // Renderize a lista de usuários aqui, incluindo botões para editar e apagar
//   )
// }

// export default RegisterForm
