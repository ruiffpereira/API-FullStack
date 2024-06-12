import { Fragment } from 'react'
import { getProductById } from '../../api/product'

function ProductDetails({ product, error }) {
  if (error) {
    return <p>{error}</p>
  }

  if (!product) {
    return <p>Product not found</p>
  }

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
  const { id } = context.query
  try {
    const product = await getProductById(id)
    if (!product) {
      return {
        notFound: true, // Next.js retornará uma página 404
      }
    }

    return {
      props: {
        product,
      },
    }
  } catch (error) {
    return {
      props: {
        error: error.message, // Retorna a mensagem de erro
      },
    }
  }
}
