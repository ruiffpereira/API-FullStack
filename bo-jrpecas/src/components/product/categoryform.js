import React, { useReducer, useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (url) => axios.get(url).then((res) => res.data)

const initialState = {
  categories: [],
  subcategories: [],
  newCategoryName: '',
  newSubcategoryName: '',
  selectedCategoryId: '',
  editCategoryId: null,
  editSubcategoryId: null,
  editCategoryName: '',
  editSubcategoryName: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    case 'SET_SUBCATEGORIES':
      return { ...state, subcategories: action.payload }
    case 'SET_NEW_CATEGORY_NAME':
      return { ...state, newCategoryName: action.payload }
    case 'SET_NEW_SUBCATEGORY_NAME':
      return { ...state, newSubcategoryName: action.payload }
    case 'SET_SELECTED_CATEGORY_ID':
      return { ...state, selectedCategoryId: action.payload }
    case 'SET_EDIT_CATEGORY':
      return {
        ...state,
        editCategoryId: action.payload.id,
        editCategoryName: action.payload.name,
      }
    case 'SET_EDIT_SUBCATEGORY':
      return {
        ...state,
        editSubcategoryId: action.payload.id,
        editSubcategoryName: action.payload.name,
      }
    case 'UPDATE_EDIT_CATEGORY_NAME':
      return { ...state, editCategoryName: action.payload }
    case 'UPDATE_EDIT_SUBCATEGORY_NAME':
      return { ...state, editSubcategoryName: action.payload }
    default:
      return state
  }
}

const CategoryList = () => {
  const {
    data: categories,
    error: categoryError,
    mutate: mutateCategories,
  } = useSWR('/api/categories', fetcher)
  const {
    data: subcategories,
    error: subcategoryError,
    mutate: mutateSubcategories,
  } = useSWR('/api/subcategories', fetcher)

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (subcategories) {
      dispatch({ type: 'SET_SUBCATEGORIES', payload: subcategories })
    }
  }, [subcategories])

  const addCategory = async () => {
    try {
      await axios.post('/api/categories', { name: state.newCategoryName })
      mutateCategories()
      dispatch({ type: 'SET_NEW_CATEGORY_NAME', payload: '' })
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const addSubcategory = async () => {
    try {
      await axios.post(
        `/api/categories/${state.selectedCategoryId}/subcategories`,
        { name: state.newSubcategoryName },
      )
      mutateSubcategories()
      dispatch({ type: 'SET_NEW_SUBCATEGORY_NAME', payload: '' })
    } catch (error) {
      console.error('Error adding subcategory:', error)
    }
  }

  const editCategory = async () => {
    try {
      await axios.put(`/api/categories/${state.editCategoryId}`, {
        name: state.editCategoryName,
      })
      mutateCategories()
      dispatch({ type: 'SET_EDIT_CATEGORY', payload: { id: null, name: '' } })
    } catch (error) {
      console.error('Error editing category:', error)
    }
  }

  const editSubcategory = async () => {
    try {
      await axios.put(`/api/subcategories/${state.editSubcategoryId}`, {
        name: state.editSubcategoryName,
      })
      mutateSubcategories()
      dispatch({
        type: 'SET_EDIT_SUBCATEGORY',
        payload: { id: null, name: '' },
      })
    } catch (error) {
      console.error('Error editing subcategory:', error)
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`/api/categories/${categoryId}`)
      mutateCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const deleteSubcategory = async (subcategoryId) => {
    try {
      await axios.delete(`/api/subcategories/${subcategoryId}`)
      mutateSubcategories()
    } catch (error) {
      console.error('Error deleting subcategory:', error)
    }
  }

  if (categoryError) return <div>Failed to load categories</div>
  if (subcategoryError) return <div>Failed to load subcategories</div>
  if (!categories || !subcategories) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      {state.categories.map((category) => (
        <div
          key={category.categoryId}
          className="mb-4 p-4 border border-gray-200 rounded-lg shadow"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-2">{category.name}</h2>
            <div>
              <button
                onClick={() =>
                  dispatch({
                    type: 'SET_EDIT_CATEGORY',
                    payload: { id: category.categoryId, name: category.name },
                  })
                }
                className="ml-2 p-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(category.categoryId)}
                className="ml-2 p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
          <ul className="list-disc list-inside ml-4">
            {state.subcategories
              .filter(
                (subcategory) => subcategory.categoryId === category.categoryId,
              )
              .map((subcategory) => (
                <li key={subcategory.subcategoryId} className="text-gray-700">
                  {subcategory.name}
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'SET_EDIT_SUBCATEGORY',
                        payload: {
                          id: subcategory.subcategoryId,
                          name: subcategory.name,
                        },
                      })
                    }
                    className="ml-2 p-2 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteSubcategory(subcategory.subcategoryId)}
                    className="ml-2 p-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}

      <div className="mb-4">
        <input
          type="text"
          value={state.newCategoryName}
          onChange={(e) =>
            dispatch({ type: 'SET_NEW_CATEGORY_NAME', payload: e.target.value })
          }
          placeholder="New Category"
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={addCategory}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Add Category
        </button>
      </div>

      <div className="mb-4">
        <select
          value={state.selectedCategoryId}
          onChange={(e) =>
            dispatch({
              type: 'SET_SELECTED_CATEGORY_ID',
              payload: e.target.value,
            })
          }
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Category</option>
          {state.categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={state.newSubcategoryName}
          onChange={(e) =>
            dispatch({
              type: 'SET_NEW_SUBCATEGORY_NAME',
              payload: e.target.value,
            })
          }
          placeholder="New Subcategory"
          className="ml-2 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={addSubcategory}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Add Subcategory
        </button>
      </div>

      {state.editCategoryId && (
        <div className="mb-4">
          <input
            type="text"
            value={state.editCategoryName}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_EDIT_CATEGORY_NAME',
                payload: e.target.value,
              })
            }
            placeholder="Edit Category"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={editCategory}
            className="ml-2 p-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </div>
      )}

      {state.editSubcategoryId && (
        <div className="mb-4">
          <input
            type="text"
            value={state.editSubcategoryName}
            onChange={(e) =>
              dispatch({
                type: 'UPDATE_EDIT_SUBCATEGORY_NAME',
                payload: e.target.value,
              })
            }
            placeholder="Edit Subcategory"
            className="p-2 border border-gray-300 rounded"
          />
          <button
            onClick={editSubcategory}
            className="ml-2 p-2 bg-green-500 text-white rounded"
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryList
