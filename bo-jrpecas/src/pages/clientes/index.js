import { Fragment } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UilEdit from "@iconscout/react-unicons/icons/uil-edit";
import { useState } from 'react';
function Clientes(props) {

  const [data, setData] = useState(props.initialData);

  return (
    <Fragment>
      <div>
        <h1 className="text-4xl font-bold mb-4">Lista de Clientes</h1>
        <Table>
          <TableCaption>Lista de Clientes </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nome</TableHead>
              <TableHead>Foto</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Historico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                
                  {row.photos && row.photos.length > 0 ? (
                    <div className="flex flex-wrap">
                      {row.photos.map((photo, i) => (
                        <img key={i} src={photo} alt="Photo" className="w-16 h-16 object-cover mr-2 mb-2" />
                      ))}
                    </div>
                  ) : (
                    'Nenhuma Foto Disponivel'
                    )
                  }
                
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Link href={`/clientes/${row.id}`}>
                    <UilEdit className="cursor-pointer ml-auto" size="16" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
              
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}

export default Clientes;


export async function getServerSideProps() {
  const res = await fetch('http://localhost:3333/clientes');
  const initialData = await res.json();

  return {
    props: { initialData },
  };
}
