import { Fragment } from "react";
import { useRouter } from "next/router";

function IndivualProduct(props) {

  const product = props.product;

  return (
    <Fragment>
      <div className="container mx-auto p-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Referencia</th>
            <th className="py-2 px-4 border-b">Preço</th>
            <th className="py-2 px-4 border-b">Categoria</th>
            <th className="py-2 px-4 border-b">Quantidade</th>
            <th className="py-2 px-4 border-b">Descricao</th>
          </tr>
        </thead>
        <tbody>
          {product.map((row, index) => (
            <tr key={row.id}>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                ) : (
                  row.nome
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <input
                    type="text"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                ) : (
                  row.referencia
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <div>
                    <input
                      type="file"
                      name="photos"
                      multiple
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-md"
                    />
                    <div className="mt-2 flex flex-wrap">
                      {formData.photos && formData.photos.map((photo, i) => (
                        <img key={i} src={photo} alt="Photo" className="w-16 h-16 object-cover mr-2 mb-2" />
                      ))}
                    </div>
                  </div>
                ) : (
                  row.photos && row.photos.length > 0 ? (
                    <div className="flex flex-wrap">
                      {row.photos.map((photo, i) => (
                        <img key={i} src={photo} alt="Photo" className="w-16 h-16 object-cover mr-2 mb-2" />
                      ))}
                    </div>
                  ) : (
                    'No Photos'
                  )
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <input
                    type="text"
                    name="preco"
                    value={formData.preco}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                ) : (
                  row.preco
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                ) : (
                  row.categoria
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <input
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                ) : (
                  row.descricao
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <input
                    type="text"
                    name="quantidade"
                    value={formData.quantidade}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md"
                  />
                ) : (
                  row.quantidade
                )}
              </td>
              <td className="py-2 px-4 border-b">
                {editIdx === index ? (
                  <button
                    className="text-green-500 hover:text-green-700"
                    onClick={() => handleSaveClick(index)}
                  >
                    <FaSave />
                  </button>
                ) : (
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleEditClick(index)}
                  >
                    <FaEdit />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      
    </Fragment>
  );
}

export default IndivualProduct;

export async function getServerSideProps() {

  const router = useRouter();
  const idPeca = router.query.id;

  const res = await fetch(`http://localhost:3333/pecas/${idPeca}`);
  const peca = await res.json();

  return {
    props: { peca },
  };
}