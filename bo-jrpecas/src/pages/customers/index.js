import { Fragment } from 'react'
import { getAllCustomers } from '@/pages/api/customer'
import { Table } from 'antd'
import Link from 'next/link'

function Clients({ customers }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      test: '1',
      render: (text, record) => (
        <Link
          href={{
            pathname: 'customers/' + record.customerId,
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Photo',
      dataIndex: 'clientID',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: () => <Link href={'clients/'}>Historico</Link>,
    // },
  ]

  return (
    <Fragment>
      <div>
        <h1 className="text-4xl font-bold mb-4">Lista de Clientes</h1>
        <Table columns={columns} dataSource={customers.rows} />
      </div>
    </Fragment>
  )
}

export default Clients

export async function getServerSideProps() {
  try {
    const customers = await getAllCustomers()

    return {
      props: { customers },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
