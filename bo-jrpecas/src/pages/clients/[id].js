import { Fragment } from 'react'
// import { getOrders } from '../api/orders'

function Client({ client }) {
  return (
    <Fragment>
      <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden mb-2">
        <div className="flex items-center p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
            <div className="mt-2 flex gap-2">
              <span className="block font-bold text-gray-600">Email</span>
              <p className="text-gray-600">{client.email}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="block font-bold text-gray-600">Contacto</span>
              <p className="text-gray-600">{client.contact}</p>
            </div>
          </div>
        </div>
      </div>
      Table com as encomendas do cliente
    </Fragment>
  )
}

export default Client

export async function getServerSideProps(context) {
  try {
    const client = context.query
    // const [ordersfromclient] = await Promise.all([getOrders()])
    return {
      props: { client },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
