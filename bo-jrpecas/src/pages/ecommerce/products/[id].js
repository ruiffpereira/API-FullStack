import { Fragment } from 'react'
import { getProducts } from '../../api/product'

function ProductDetails({ product }) {
  return (
    <Fragment>
      <div className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden mb-2">
        <div className="flex items-center p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <div className="mt-2 flex gap-2">
              <span className="block font-bold text-gray-600">Referencia</span>
              <p className="text-gray-600">{product.reference}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="block font-bold text-gray-600">Descricao</span>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="block font-bold text-gray-600">Stock</span>
              <p className="text-gray-600">{product.stock}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="block font-bold text-gray-600">Fotos</span>
              <p className="text-gray-600">{product.photos}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <span className="block font-bold text-gray-600">Categoria</span>
              <p className="text-gray-600">{product.subcategoryID}</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ProductDetails

export async function getServerSideProps(context) {
  try {
    const product = context.query
    const teste = await getProducts(product.productID)
    console.log(teste)
    return {
      props: { product },
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    return {
      props: { error },
    }
  }
}
