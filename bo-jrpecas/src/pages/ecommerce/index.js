import { Fragment } from 'react'
import Products from './products'
import { getAllProducts } from '../api/product'
import { getAllOrders } from '../api/order'
import Orders from './orders'

function Ecommerce({ products, orders, error }) {
  if (error) {
    return <div>Error: {error}</div>
  }

  if (!products) {
    return <div>Loading...</div>
  }

  return (
    <Fragment>
      <Products products={products} />
      <Orders orders={orders} />
    </Fragment>
  )
}

export default Ecommerce

export async function getServerSideProps() {
  try {
    const products = await getAllProducts()
    const orders = await getAllOrders()
    // console.log(orders)
    return {
      props: { products, orders },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
