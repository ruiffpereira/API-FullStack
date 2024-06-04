import { Fragment } from 'react'
import Link from 'next/link'

function Dashboard({ data }) {
  const { clients, orders } = data

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
            href="/clients"
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
