// import React, { useState, useEffect } from 'react'
// import { supabase } from '../lib/supabase'

// interface User {
//   id: string
//   telefono: string
//   nombre_negocio: string
// }

// export default function UserManagement() {
//   const [users, setUsers] = useState<User[]>([])
//   const [telefono, setTelefono] = useState('')
//   const [contrasena, setContrasena] = useState('')
//   const [nombreNegocio, setNombreNegocio] = useState('')
//   const [editingUserId, setEditingUserId] = useState<string | null>(null)

//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   async function fetchUsers() {
//     const { data, error } = await supabase
//       .from('usuarios')
//       .select('*')
//       .eq('es_admin', false)

//     if (error) {
//       console.error('Error fetching users:', error)
//     } else {
//       setUsers(data || [])
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault()
//     if  (editingUserId) {
//       await updateUser()
//     } else {
//       await createUser()
//     }
//   }

//   async function createUser() {
//     const { data, error } = await supabase
//       .from('usuarios')
//       .insert([
//         { telefono, contrasena, nombre_negocio: nombreNegocio, es_admin: false }
//       ])

//     if (error) {
//       console.error('Error creating user:', error)
//     } else {
//       clearForm()
//       fetchUsers()
//     }
//   }

//   async function updateUser() {
//     const { data, error } = await supabase
//       .from('usuarios')
//       .update({ telefono, contrasena, nombre_negocio: nombreNegocio })
//       .eq('id', editingUserId)

//     if (error) {
//       console.error('Error updating user:', error)
//     } else {
//       clearForm()
//       fetchUsers()
//     }
//   }

//   async function deleteUser(id: string) {
//     const { error } = await supabase
//       .from('usuarios')
//       .delete()
//       .eq('id', id)

//     if (error) {
//       console.error('Error deleting user:', error)
//     } else {
//       fetchUsers()
//     }
//   }

//   function clearForm() {
//     setTelefono('')
//     setContrasena('')
//     setNombreNegocio('')
//     setEditingUserId(null)
//   }

//   function startEditing(user: User) {
//     setTelefono(user.telefono)
//     setNombreNegocio(user.nombre_negocio)
//     setEditingUserId(user.id)
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
//       <form onSubmit={handleSubmit} className="mb-8">
//         <div className="mb-4">
//           <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
//             Teléfono
//           </label>
//           <input
//             type="tel"
//             id="telefono"
//             value={telefono}
//             onChange={(e) => setTelefono(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
//             Contraseña
//           </label>
//           <input
//             type="password"
//             id="contrasena"
//             value={contrasena}
//             onChange={(e) => setContrasena(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="nombreNegocio" className="block text-sm font-medium text-gray-700">
//             Nombre del Negocio
//           </label>
//           <input
//             type="text"
//             id="nombreNegocio"
//             value={nombreNegocio}
//             onChange={(e) => setNombreNegocio(e.target.value)}
//             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           {editingUserId ? 'Actualizar Usuario' : 'Crear Usuario'}
//         </button>
//       </form>

//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Teléfono
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Nombre del Negocio
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Acciones
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td className="px-6 py-4 whitespace-nowrap">{user.telefono}</td>
//               <td className="px-6 py-4 whitespace-nowrap">{user.nombre_negocio}</td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <button
//                   onClick={() => startEditing(user)}
//                   className="text-indigo-600 hover:text-indigo-900 mr-2"
//                 >
//                   Editar
//                 </button>
//                 <button
//                   onClick={() => deleteUser(user.id)}
//                   className="text-red-600 hover:text-red-900"
//                 >
//                   Eliminar
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }