import { Fragment } from 'react'
import Dashboard from './dashboard'
import { getAllCustomers } from './api/customer'
import { getAllOrders } from './api/order'

export default function Home({ clients, orders }) {
  return (
    <Fragment>
      <Dashboard data={{ clients, orders }}></Dashboard>
    </Fragment>
  )
}

export async function getServerSideProps() {
  try {
    const [clients, orders] = await Promise.all([
      getAllCustomers(),
      getAllOrders(),
    ])
    console.log(clients)
    return {
      props: { clients, orders },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
