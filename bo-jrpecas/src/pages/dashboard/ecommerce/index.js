import { Fragment, useState } from 'react'
import Products from './products'
import { getAllProducts } from '@/pages/api/product'
import { getAllOrders } from '@/pages/api/order'
import Orders from './orders'
import CategoryList from '@/components/product/categoryform'
import { getAllCategories } from '@/pages/api/category'
import Link from 'next/link'
import { checkSession } from '@/utils/checkSession'
import { getSession } from 'next-auth/react'

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
        <Link
          href="/ecommerce/products/newProduct"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Adicionar Peça
        </Link>
        <button
          onClick={() => setCategoryForm(!categoryForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {!categoryForm ? <div>Gerir Categoriass</div> : <div>Ecommerce</div>}
        </button>
      </div>
      {!categoryForm ? (
        <div>
          <Products products={products} />
          <Orders orders={orders} />
        </div>
      ) : (
        <Fragment>
          <CategoryList categorylist={categories} />
        </Fragment>
      )}
    </Fragment>
  )
}

export default Ecommerce

export async function getServerSideProps(context) {
  const sessionCheckResult = await checkSession(context.req)
  if (sessionCheckResult) {
    return sessionCheckResult
  }
  const token = await getSession(context)
  try {
    const products = await getAllProducts(token.accessToken)
    const orders = await getAllOrders(token.accessToken)
    const categories = await getAllCategories(token.accessToken)
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
