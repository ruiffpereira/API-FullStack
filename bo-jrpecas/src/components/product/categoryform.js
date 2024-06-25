import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const fetcher = (url) => fetch(url).then((res) => res.json())

const CategoryManager = ({ categorylist }) => {
  const { data, isLoading } = useSWR(`${BASE_URL}/categories`, fetcher, {
    categorylist,
  })
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategory, setNewSubcategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editCategory, setEditCategory] = useState(null)
  const [editSubcategory, setEditSubcategory] = useState(null)
  const { mutate } = useSWRConfig()

  const { trigger: addCategory } = useSWRMutation(
    `${BASE_URL}/categories`,
    async (url) => {
      if (newCategory === '') return
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategory,
        }),
      })
      if (!response.ok) {
        throw new Error('A resposta da rede não foi ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        mutate(`${BASE_URL}/categories`)
        setNewCategory('')
      },
    },
  )

  const { trigger: addSubcategory } = useSWRMutation(
    `${BASE_URL}/subcategories`,
    async (url) => {
      if (selectedCategory === '') {
        return
      }
      if (newSubcategory === '') {
        return
      }
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedCategory, newSubcategory }),
      })
      if (!response.ok) {
        throw new Error('A resposta da rede não foi ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        mutate(`${BASE_URL}/categories`)
      },
    },
  )

  const { trigger: deleteCategory } = useSWRMutation(
    `${BASE_URL}/categories`,
    async (url, { arg: categoryId }) => {
      const response = await fetch(`${url}/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('A resposta da rede não foi ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        mutate(`${BASE_URL}/categories`)
      },
    },
  )

  const { trigger: deleteSubcategory } = useSWRMutation(
    `${BASE_URL}/subcategories`,
    async (url, { arg }) => {
      const response = await fetch(`${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      if (!response.ok) {
        throw new Error('A resposta da rede não foi ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        mutate(`${BASE_URL}/categories`)
      },
    },
  )

  const { trigger: updateCategory } = useSWRMutation(
    `${BASE_URL}/categories`,
    async (url, { arg }) => {
      const response = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      if (!response.ok) {
        throw new Error('A resposta da rede não foi ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        mutate(`${BASE_URL}/categories`)
        setEditCategory(null)
      },
    },
  )

  const { trigger: updateSubcategory } = useSWRMutation(
    `${BASE_URL}/subcategories`,
    async (url, { arg }) => {
      const response = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      if (!response.ok) {
        throw new Error('A resposta da rede não foi ok')
      }
      return response.json()
    },
    {
      onSuccess: () => {
        mutate(`${BASE_URL}/categories`)
        setEditSubcategory(null)
      },
    },
  )

  // if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div className="p-6 bg-white rounded-xl shadow-md space-y-4 text-left">
      <h1 className="text-xl font-bold">Gerenciador de Categorias</h1>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nova Categoria"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Adicionar Categoria
        </button>
      </div>

      <div className="space-y-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Selecione uma Categoria</option>
          {data.rows.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nova Subcategoria"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={addSubcategory}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Adicionar Subcategoria
        </button>
      </div>

      <div className="space-y-4">
        {data.rows.map((category) => (
          <div key={category.categoryId} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              {editCategory?.id === category.categoryId ? (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                    className="border p-2"
                  />
                  <button
                    onClick={() =>
                      updateCategory({
                        categoryId: category.categoryId,
                        name: editCategory.name,
                      })
                    }
                    className="bg-green-500 text-white px-2 py-1 rounded ml-auto"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditCategory(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-grow">
                  <h2 className="text-lg font-bold flex-grow">
                    {category.name}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditCategory({
                          id: category.categoryId,
                          name: category.name,
                        })
                      }
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteCategory(category.categoryId)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              )}
            </div>
            {category.subcategories.length > 0 ? (
              <ul className="list-disc list-inside mt-2 flex flex-col gap-2">
                {category.subcategories.map((subcategory) => (
                  <li
                    key={subcategory.subcategoryId}
                    className="flex justify-between items-center"
                  >
                    {editSubcategory?.id === subcategory.subcategoryId ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editSubcategory.name}
                          onChange={(e) =>
                            setEditSubcategory({
                              ...editSubcategory,
                              name: e.target.value,
                            })
                          }
                          className="border p-2"
                        />
                        <button
                          onClick={() =>
                            updateSubcategory({
                              categoryId: category.categoryId,
                              subcategoryId: subcategory.subcategoryId,
                              name: editSubcategory.name,
                            })
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditSubcategory(null)}
                          className="bg-gray-500 text-white px-2 py-1 rounded"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <span>{subcategory.name}</span>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setEditSubcategory({
                            id: subcategory.subcategoryId,
                            name: subcategory.name,
                          })
                        }
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          deleteSubcategory({
                            categoryId: category.categoryId,
                            subcategoryId: subcategory.subcategoryId,
                          })
                        }
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Apagar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Esta categoria não tem subcategorias.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryManager
