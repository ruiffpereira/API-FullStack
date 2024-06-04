import { Fragment } from 'react'
import Dashboard from './dashboard'
import { getClients } from './api/clients'
import { getOrders } from './api/orders'

export default function Home({ clients, orders }) {
  return (
    <Fragment>
      <Dashboard data={{ clients, orders }}></Dashboard>
    </Fragment>
  )
}

export async function getServerSideProps() {
  try {
    const [clients, orders] = await Promise.all([getClients(), getOrders()])
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
