import { Fragment, useState } from 'react'
import Products from './products'
import { getAllProducts } from '../api/product'
import { getAllOrders } from '../api/order'
import Orders from './orders'
import CategoryManager from '@/components/product/categoryform'
import { getAllCategories } from '../api/category'

function Ecommerce({ products, orders, categories, error }) {
  const [categoryForm, setCategoryForm] = useState(false)

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!products) {
    return <div>Loading...</div>
  }

  return (
    <Fragment>
      <div className="flex justify-end gap-2 items-center mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Adicionar Peça
        </button>
        <button
          onClick={() => setCategoryForm(!categoryForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {!categoryForm ? <div>Gerir Categorias</div> : <div>Ecommerce</div>}
        </button>
      </div>
      {!categoryForm ? (
        <div>
          <Products products={products} />
          <Orders orders={orders} />
        </div>
      ) : (
        <Fragment>
          <CategoryManager data={categories} />
        </Fragment>
      )}
    </Fragment>
  )
}

export default Ecommerce

export async function getServerSideProps() {
  try {
    const products = await getAllProducts()
    const orders = await getAllOrders()
    const categories = await getAllCategories()
    // console.log(categories)
    return {
      props: { products, orders, categories },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
