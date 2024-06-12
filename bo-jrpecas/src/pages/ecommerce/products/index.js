import { Fragment } from 'react'
import Link from 'next/link'
import { Table } from 'antd'

function AddProduct({ products }) {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Link
          href={{
            pathname: '/ecommerce/products/' + record.productId,
          }}
        >
          {record.name}
        </Link>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'categoryname',
      render: (text, record) => record.category.name,
    },
    {
      title: 'Photos',
      dataIndex: 'photos',
    },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: () => <Link href={'clients/'}>Historico</Link>,
    // },
  ]
  return (
    <Fragment>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Tabela de Peças</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Adicionar Peça
        </button>
      </div>
      <Table columns={columns} dataSource={products.rows} />
    </Fragment>
  )
}

export default AddProduct
