import { Fragment, useState } from 'react'
import { getProductById } from '../../api/product'
import { getAllCategories } from '../../api/category'
import { FaEdit, FaSave, FaWindowClose } from 'react-icons/fa'
import AntdCascader from '@/components/cascader'
import useSWRMutation from 'swr/mutation'
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const fetcher = (url, formData) => {
  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...formData.arg }),
  }).then((res) => res.json())
}

function ProductDetails({ product, categories, sserror }) {
  const productReceive = {
    name: product.name,
    description: product.description,
    stock: product.stock,
    reference: product.reference,
    categoryId: product.category?.categoryId ?? null,
    subcategoryId: product.subcategory?.subcategoryId ?? null,
    category: product.category?.name ?? null,
    subcategory: product.subcategory?.name ?? null,
  }

  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState(productReceive)
  const { trigger, isMutating, data, error } = useSWRMutation(
    `${BASE_URL}/products/${product.productId}`,
    fetcher,
  )

  const allCategoriesCascader = categories.rows.map((category) => {
    const transformedCategory = {
      value: category.categoryId,
      label: category.name,
    }
    if (category.subcategories && category.subcategories.length > 0) {
      transformedCategory.children = category.subcategories.map(
        (subcategory) => ({
          value: subcategory.subcategoryId,
          label: subcategory.name,
        }),
      )
    }

    return transformedCategory
  })

  if (sserror) {
    return <p>error</p>
  }

  if (!product) {
    return <p>Product not found</p>
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const toggleEditing = () => {
    setEditing(!editing)
  }

  const handleCascaderChange = (index, selectedOptions) => {
    if (selectedOptions.length === 2) {
      setFormData({
        ...formData,
        categoryId: selectedOptions[0].value,
        category: selectedOptions[0].label,
        subcategoryId: selectedOptions[1].value,
        subcategory: selectedOptions[1].label,
      })
    }
    if (selectedOptions.length === 1) {
      setFormData({
        ...formData,
        categoryId: selectedOptions[0].value,
        category: selectedOptions[0].label,
        subcategoryId: null,
        subcategory: null,
      })
    }
  }

  const handleCancel = () => {
    setFormData(productReceive)
    setEditing(!editing)
  }

  async function handleSave() {
    try {
      await trigger(formData)
      setEditing(false)
    } catch (err) {
      return err
    }
  }

  return (
    <Fragment>
      <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden mb-2">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1">
            <div className="block font-bold text-gray-600 text-base">
              Product
            </div>
            {editing === false ? (
              <p className="text-gray-600 text-sm">{formData.name}</p>
            ) : (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-2 text-sm"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="block font-bold text-gray-600 text-base">
              Reference
            </span>
            {editing === false ? (
              <p className="text-gray-600 text-sm">{formData.reference}</p>
            ) : (
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-2 text-sm"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="block font-bold text-gray-600 text-base">
              Description
            </span>
            {editing === false ? (
              <p className="text-gray-600 text-sm">{formData.description}</p>
            ) : (
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-2 text-sm"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="block font-bold text-gray-600 text-base">
              Stock
            </span>
            {editing === false ? (
              <p className="text-gray-600 text-sm">{formData.stock}</p>
            ) : (
              <input
                type="text"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-2 text-sm"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="block font-bold text-gray-600 text-base">
              Photos
            </span>
            <p className="text-gray-600">{formData.photos}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="block font-bold text-gray-600 text-base">
              Category
            </span>
            {editing === false ? (
              <p className="text-gray-600 text-sm">
                {formData.category}
                {formData.subcategory && <span> / {formData.subcategory}</span>}
              </p>
            ) : (
              <AntdCascader
                defaultValue={[formData.category, formData.subcategory]}
                onChange={handleCascaderChange}
                data={allCategoriesCascader}
              />
            )}
          </div>
          {editing === false ? (
            <button
              className="ml-auto text-green-500 hover:text-green-700"
              onClick={() => toggleEditing()}
            >
              <FaEdit />
            </button>
          ) : (
            <div className="ml-auto flex gap-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={handleCancel}
              >
                <FaWindowClose />
              </button>
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={handleSave}
              >
                <FaSave />
              </button>
            </div>
          )}
          {isMutating && 'Updating...'}
          {error && <div>Error: {error.message}</div>}
          {data && <div>Success: {JSON.stringify(data)}</div>}
        </div>
      </div>
    </Fragment>
  )
}

export default ProductDetails

export async function getServerSideProps(context) {
  const { id } = context.query
  let product = null
  let categories = null
  let sserror = null

  try {
    product = await getProductById(id)
    categories = await getAllCategories()

    if (!product || !categories) {
      return {
        notFound: true, // Next.js retornará uma página 404
      }
    }
  } catch (err) {
    sserror = err.message
  }

  // console.log(categories)
  return {
    props: {
      product,
      categories,
      sserror,
    },
  }
}
