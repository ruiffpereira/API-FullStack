import { Fragment } from "react";
import { useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import Link from "next/link";

function addProduct(props) {
  const [data, setData] = useState(props.pecas);
  const [editIdx, setEditIdx] = useState(-1);
  const [formData, setFormData] = useState({});

  return (
    <Fragment>
      <div className="flex gap-1 flex-col">
        <h1 className="text-4xl font-bold mb-4">
          Adicionar Peça
        </h1>
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
  );
}

export default addProduct;
