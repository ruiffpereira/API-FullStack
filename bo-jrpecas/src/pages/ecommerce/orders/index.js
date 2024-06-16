// components/TableWithEdit.js
import Link from 'next/link'
import { Fragment } from 'react'
import { Table } from 'antd'

function Orders({ orders }) {
  // console.log(orders)
  const columns = [
    {
      title: 'Referencia Encomenda',
      dataIndex: 'orderId',
      render: (text, record) => (
        <Link
          href={{
            pathname: '/ecommerce/orders/' + record.orderId,
          }}
        >
          {record.orderId}
        </Link>
      ),
    },
    {
      title: 'Clients',
      dataIndex: 'Customer',
      render: (text, record) => (
        <Link
          href={{
            pathname: 'customers/' + record.customer.customerId,
          }}
        >
          {record.customer.name}
        </Link>
      ),
    },
    {
      title: 'TotalPrice',
      dataIndex: 'clientID',
      render: () => <div>99€</div>,
    },
    {
      title: 'Quantidade',
      dataIndex: 'amount',
      render: () => <div>3</div>,
    },
    {
      title: 'Morada',
      dataIndex: 'contact',
      render: () => <div>Rua das Cumieiras</div>,
    },
  ]

  return (
    <Fragment>
      <div>
        <h1 className="text-4xl font-bold mb-4">Lista de Encomendas</h1>
        <Table
          rowKey={orders.rows.orderId}
          columns={columns}
          dataSource={orders.rows}
        />
      </div>
    </Fragment>
  )
}

export default Orders
