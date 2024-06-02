import { Fragment, useState, Image } from 'react'
import { FaEdit, FaSave } from 'react-icons/fa'

function AddProduct(props) {
  const [data, setData] = useState(props.product)
  const [editIdx, setEditIdx] = useState(-1)
  const [formData, setFormData] = useState({})

  const handleEditClick = (index) => {
    setEditIdx(index)
    setFormData(data[index])
  }

  const handleSaveClick = async (index) => {
    const response = await fetch('/api/data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      const updatedData = data.map((item, i) => (i === index ? formData : item))
      setData(updatedData)
      setEditIdx(-1)
    } else {
      console.error('Failed to update data')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then((urls) => {
      setFormData({ ...formData, photos: (formData.photos || []).concat(urls) })
    })
  }

  return (
    <Fragment>
      <div className="container mx-auto p-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Referencia</th>
              <th className="py-2 px-4 border-b">Fotos</th>
              <th className="py-2 px-4 border-b">Preço</th>
              <th className="py-2 px-4 border-b">Categoria</th>
              <th className="py-2 px-4 border-b">Descricao</th>
              <th className="py-2 px-4 border-b">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.productID}>
                <td className="py-2 px-4 border-b">
                  {editIdx === index ? (
                    <input
                      type="text"
                      name="nome"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md"
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editIdx === index ? (
                    <input
                      type="text"
                      name="referencia"
                      value={formData.reference}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md"
                    />
                  ) : (
                    row.reference
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
                        {formData.photos &&
                          formData.photos.map((photo, i) => (
                            <Image
                              key={i}
                              src={photo}
                              alt="Photo"
                              className="w-16 h-16 object-cover mr-2 mb-2"
                            />
                          ))}
                      </div>
                    </div>
                  ) : row.photos && row.photos.length > 0 ? (
                    <div className="flex flex-wrap">
                      {row.photos.map((photo, i) => (
                        <Image
                          key={i}
                          src={photo}
                          alt="Photo"
                          className="w-16 h-16 object-cover mr-2 mb-2"
                        />
                      ))}
                    </div>
                  ) : (
                    'No Photos'
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editIdx === index ? (
                    <input
                      type="text"
                      name="preco"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md"
                    />
                  ) : (
                    row.price
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editIdx === index ? (
                    <input
                      type="text"
                      name="categoria"
                      value={formData.subcategoryID}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md"
                    />
                  ) : (
                    row.subcategoryID
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
                    row.description
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {editIdx === index ? (
                    <input
                      type="text"
                      name="quantidade"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md"
                    />
                  ) : (
                    row.stock
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

      <div className="flex gap-1 flex-col">
        <h1 className="text-4xl font-bold mb-4">Adicionar Peça</h1>
        <input type="text" placeholder="Marca" />
        <input type="text" placeholder="Modelo" />
        <input type="text" placeholder="Nome da peça" />
        <input type="text" placeholder="Referencia" />
        <input type="text" placeholder="Fotos" />
        <input type="text" placeholder="Descricao" />
        <input type="text" placeholder="Preço" />
        <input type="text" placeholder="Quantidade Disponivel" />
        <input type="text" placeholder="Visivel no website" />
      </div>
    </Fragment>
  )
}

export default AddProduct
