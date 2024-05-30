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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ClienteID() {
  return (
    <Fragment>
      <h1>Rui Pereira</h1>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="absolute right-0 bottom-0 text-sm">
                editphotp
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div>Rui Pereira</div>
              <div>Portugal</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="">Nome</div>
          <input></input>
        </div>
        <div className="flex flex-col gap-2">
          <div className="">Email</div>
          <input></input>
        </div>
        <div className="flex flex-col gap-2">
          <div className="">Numero</div>
          <input></input>
        </div>
        <div className="flex flex-col gap-2">
          <div className="">Morada completa</div>
          <input></input>
        </div>
      </div>
      <Table>
        <TableCaption>Historico de cliente </TableCaption>
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
              <UilEdit className="cursor-pointer ml-auto" size="16" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Fragment>
  );
}

export default ClienteID;
