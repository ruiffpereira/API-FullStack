import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UilEdit from "../../node_modules/@iconscout/react-unicons/icons/uil-edit";
import Link from "next/link";
import Categorias from "./categorias";

function Ecommerce() {
  return (
    <Fragment>
      <div>
        <h1 className="text-4xl font-bold mb-4">Lista de Encomendas</h1>
        <Table>
          <TableCaption>Lista de carros </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Matricula carro</TableHead>
              <TableHead>Carro</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">AJ-17-HA</TableCell>
              <TableCell>BMW</TableCell>
              <TableCell>16/11/2023</TableCell>
              <TableCell>
                <Link className="cursor-pointer" href="clientes/1">
                  Rui Pereira
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Link href="/ecommerce/detalhes-encomenda/1">
                  <UilEdit className="cursor-pointer ml-auto" size="16" />
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Categorias/>
    </Fragment>
  );
}

export default Ecommerce;
