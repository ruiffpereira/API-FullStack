import { Fragment } from 'react'
import { getClients } from '../api/customer'
import { Table } from 'antd'
import Link from 'next/link'

function Clients({ clients }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      test: '1',
      render: (text, record) => (
        <Link
          href={{
            pathname: 'clients/' + record.clientID,
            query: record,
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
        <Table columns={columns} dataSource={clients.rows} />
      </div>
    </Fragment>
  )
}

export default Clients

export async function getServerSideProps() {
  try {
    const [clients] = await Promise.all([getClients()])

    return {
      props: { clients },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
