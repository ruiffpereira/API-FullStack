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
import UilEdit from "../../node_modules/@iconscout/react-unicons/icons/uil-edit";
function Clientes() {
  return (
    <Fragment>
      <div>
        <h1 className="text-4xl font-bold mb-4">Lista de Clientess</h1>
        <Table>
          <TableCaption>Lista de carros </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Matricula carro</TableHead>
              <TableHead>Carro</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">AJ-17-HA</TableCell>
              <TableCell>BMW</TableCell>
              <TableCell>16/11/2023</TableCell>
              <TableCell className="text-right">
                <Link href="clientes/1">
                  <UilEdit className="cursor-pointer ml-auto" size="16" />
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Fragment>
  );
}

export default Clientes;
