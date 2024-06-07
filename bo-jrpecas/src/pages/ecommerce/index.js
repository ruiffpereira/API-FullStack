import { Fragment } from 'react'
// import Orders from './orders'
import Products from './products'
import { getProducts } from '../api/product'

function Ecommerce({ products, error }) {
  if (error) {
    return <div>Error: {error}</div>
  }

  if (!products) {
    return <div>Loading...</div>
  }

  return (
    <Fragment>
      <Products products={products} />
    </Fragment>
  )
}

export default Ecommerce

export async function getServerSideProps() {
  try {
    const products = await getProducts()
    return {
      props: { products },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
