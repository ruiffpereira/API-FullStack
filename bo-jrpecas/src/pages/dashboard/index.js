import { Fragment } from "react";
import Link from "next/link";

function Dashboard() {
  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Link
            href="/ecommerce"
            className="flex flex-col gap-2 border rounded-sm border-black p-4 hover:bg-slate-300 cursor-pointer transition-all"
          >
            <h1 className="text-xs">Encomendas do Mes</h1>
            <p className="text-slate">42</p>
          </Link>
          <Link
            href="/clientes"
            className="flex flex-col gap-2 border rounded-sm border-black p-4 hover:bg-slate-300 cursor-pointer transition-all"
          >
            <h1 className="text-xs">Numero de Clientes</h1>
            <p className="text-slate">20</p>
          </Link>
        </div>
      </div>
    </Fragment>
  );
}

export default Dashboard;
