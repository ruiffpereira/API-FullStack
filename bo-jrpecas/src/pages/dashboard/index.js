import { Fragment } from 'react'
import Link from 'next/link'
import { getClients } from '../api/clients'

function Dashboard({ clients, error }) {
  if (error) {
    return <div>Error: {error}</div>
  }

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
            <p className="text-slate">42</p>
          </Link>
          <Link
            href="/clientes"
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
  let clients = null
  let error = null
  try {
    clients = await getClients()
  } catch (err) {
    error = err.message
  }
  return {
    props: { clients, error },
  }
}
