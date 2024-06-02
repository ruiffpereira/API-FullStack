import { Fragment } from 'react'
// import Orders from './orders'
import Products from './products'
import { getProducts } from '../api/products'

function Ecommerce({ products, error }) {
  if (error) {
    return <div>Error: {error}</div>
  }

  if (!products) {
    return <div>Loading...</div>
  }
  return (
    <Fragment>
      {/* <Orders orders={props.orders}/> */}
      <Products product={products} />
    </Fragment>
  )
}

export default Ecommerce

export async function getServerSideProps() {
  let products = null
  let error = null
  try {
    products = await getProducts()
  } catch (err) {
    error = err.message
  }
  return {
    props: { products, error },
  }
}
