// components/TableWithEdit.js
import Link from 'next/link'
import { useState } from 'react'
import { FaEdit, FaSave } from 'react-icons/fa'

function Orders(props) {
  const [data, setData] = useState(props.orders)

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Cliente</th>
            <th className="py-2 px-4 border-b">Peça</th>
            <th className="py-2 px-4 border-b">Valor</th>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Estado de Pagamento</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="py-2 px-4 border-b">{row.ClienteID}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/pecas/${row.id}`}>{row.peca}</Link>
              </td>
              <td className="py-2 px-4 border-b">{row.valor}</td>
              <td className="py-2 px-4 border-b">{row.data}</td>
              <td className="py-2 px-4 border-b">{row.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Orders
