import { Fragment } from "react";
import Link from "next/link";
import UilEdit from "@iconscout/react-unicons/icons/uil-edit";
import { useState } from 'react';

function Clients(props) {

  const [data, setData] = useState(props.initialData);

  return (
    <Fragment>
      <div>
        <h1 className="text-4xl font-bold mb-4">Lista de Clientes</h1>
      </div>
    </Fragment>
  );
}

export default Clients;


export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/clients');
  const initialData = await res.json();

  return {
    props: { initialData },
  };
}
