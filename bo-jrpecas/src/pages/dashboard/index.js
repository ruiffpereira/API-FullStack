import { Fragment } from 'react'
import Link from 'next/link'
import { getAllCustomers } from '../api/customer'
import { getAllOrders } from '../api/order'

function Dashboard({ clients, orders }) {
  if (!clients) {
    return <div>Loading...</div>
  }

  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Link
            href="/ecommerce"
            className="flex flex-col gap-2 border rounded-sm border-black p-4 hover:bg-slate-300 cursor-pointer transition-all"
          >
            <h1 className="text-xs">Encomendas do Mes</h1>
            <p className="text-slate">{orders.count}</p>
          </Link>
          <Link
            href="/customers"
            className="flex flex-col gap-2 border rounded-sm border-black p-4 hover:bg-slate-300 cursor-pointer transition-all"
          >
            <h1 className="text-xs">Numero de Clientes</h1>
            <p className="text-slate">{clients.count}</p>
          </Link>
        </div>
      </div>
    </Fragment>
  )
}

export default Dashboard

export async function getServerSideProps() {
  try {
    const [clients, orders] = await Promise.all([
      getAllCustomers(),
      getAllOrders(),
    ])
    // console.log(clients)
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
