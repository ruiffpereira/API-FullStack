import { Fragment } from "react";
import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import Link from "next/link";

function AdcionarPecas(props) {
  const [data, setData] = useState(props.pecas);
  const [editIdx, setEditIdx] = useState(-1);
  const [formData, setFormData] = useState({});

  return (
    <Fragment>
      <div className="flex gap-1 flex-col">
        <h1 className="text-4xl font-bold mb-4">
          Adicionar Peça
        </h1>
        <Input type="text" placeholder="Marca" />
        <Input type="text" placeholder="Modelo" />
        <Input type="text" placeholder="Nome da peça" />
        <Input type="text" placeholder="Referencia" />
        <Input type="text" placeholder="Fotos" />
        <Input type="text" placeholder="Descricao" />
        <Input type="text" placeholder="Preço" />
        <Input type="text" placeholder="Quantidade Disponivel" />
        <Input type="text" placeholder="Visivel no website" />
      </div>
    </Fragment>
  );
}

export default AdcionarPecas;
