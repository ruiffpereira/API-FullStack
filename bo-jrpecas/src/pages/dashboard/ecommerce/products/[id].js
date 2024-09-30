// components/ProductForm.js

import AntdCascader from '@/components/cascader'
import Link from 'next/link'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import useSWR, { mutate, useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useRouter } from 'next/router'
import { checkSession } from '@/utils/checkSession'
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const ProductForm = ({ product, categories }) => {
  const [formData, setFormData] = useState({
    productId: product?.productId || '',
    name: product?.name || '',
    reference: product?.reference || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    photos: product?.photos || [],
    category: product?.category?.name || '',
    subcategory: product?.subcategory?.name || '',
    categoryId: product?.categoryId || '',
    subcategoryId: product?.subcategoryId || '',
  })
  const router = useRouter()

  const handleSubmit = async (event) => {
    event.preventDefault() // Prevenir o comportamento padrão de recarregar a página
    const method = product?.productId ? 'PUT' : 'POST'
    try {
      const response = await fetch(`${BASE_URL}/products`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.log(errorData.message)
        throw new Error(errorData.message)
      }

      const data = await response.json()

      // Success handler
      mutate(`${BASE_URL}/products`)
      console.log('Sucesso! Produto deletado.', data)
      router.push('/ecommerce')
    } catch (error) {
      console.error('Erro ao deletar o produto:', error)
    }
  }

  const { trigger: deleteProduct } = useSWRMutation(
    `${BASE_URL}/products/${formData.productId}`,
    async (url) => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        return response.json().then((errorData) => {
          console.log(errorData.message)
          throw new Error(errorData.message)
        })
      }
      mutate(`${BASE_URL}/products`)
      router.push('/ecommerce')
      return response.json()
    },
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCascaderChange = (value) => {
    if (value === undefined) {
      setFormData((prev) => ({
        ...prev,
        categoryId: null,
        category: null,
        subcategory: null,
        subcategoryId: null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        categoryId: value[0],
        subcategoryId: value[1],
      }))
    }
  }

  const onDrop = (acceptedFiles) => {
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...acceptedFiles],
    }))
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  // Transformando categorias e subcategorias para o formato do Cascader
  const categoryOptions = categories.rows.map((category) => ({
    value: category.categoryId,
    label: category.name,
    children: category.subcategories.map((subcategory) => ({
      value: subcategory.subcategoryId,
      label: subcategory.name,
    })),
  }))

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white shadow-lg rounded-lg"
    >
      <div className="flex flex-col space-y-4">
        <label className="text-gray-600 font-semibold">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-gray-600 font-semibold">Reference:</label>
        <input
          type="text"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-gray-600 font-semibold">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-gray-600 font-semibold">Price:</label>
        <textarea
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-gray-600 font-semibold">Stock:</label>
        <textarea
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-gray-600 font-semibold">Photos:</label>
        <div
          {...getRootProps()}
          className="border-dashed border-2 border-gray-300 p-4 rounded-md"
        >
          <input {...getInputProps()} />
          <p>Drag drop some files here, or click to select files</p>
        </div>
        <div className="mt-2">
          {formData.photos.map((file, index) => (
            <div key={index} className="text-sm text-gray-600">
              {file.name || file}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <label className="text-gray-600 font-semibold">Category:</label>
        <AntdCascader
          data={categoryOptions}
          onChange={handleCascaderChange}
          defaultValue={[formData.category, formData.subcategory]}
          placeholder="Select Category and Subcategory"
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex gap-2">
        <Link
          className="w-full text-center py-3 mt-6 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          href="/ecommerce"
        >
          Back
        </Link>
        <button
          type="submit"
          className="w-full py-3 mt-6 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {product?.productId ? 'Update' : 'Create'} Product
        </button>
        {product?.productId && (
          <button
            onClick={deleteProduct}
            className="w-full py-3 mt-6 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}

export default ProductForm

export async function getServerSideProps(context) {
  const sessionCheckResult = await checkSession(context.req)
  if (sessionCheckResult) {
    return sessionCheckResult
  }

  const { id } = context.params
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  // Fetch product data
  const productRes = await fetch(`${BASE_URL}/products/${id}`)
  let product = await productRes.json()

  if (product.error) product = null

  // Fetch categories data
  const categoriesRes = await fetch(`${BASE_URL}/categories`)
  const categories = await categoriesRes.json()

  console.log('teste')

  return {
    props: {
      product,
      categories,
    },
  }
}
