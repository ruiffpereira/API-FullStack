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
      <h1 className="text-3xl font-bold">Tabela de Peças</h1>
      <Table
        rowKey={products.rows.productId}
        columns={columns}
        dataSource={products.rows}
      />
    </Fragment>
  )
}

export default AddProduct
