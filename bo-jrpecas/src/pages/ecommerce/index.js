import { Fragment } from "react";
import Encomendas from "./encomendas";
import Pecas from "./pecas";

function Ecommerce(props) {
  return (
    <Fragment>
      <Encomendas encomendas={props.encomendas}/>
      <Pecas pecas={props.pecas}/>
    </Fragment>
  );
}

export default Ecommerce;

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3333/encomendas');
  const encomendas = await res.json();

  const res1 = await fetch('http://localhost:3333/pecas');
  const pecas = await res1.json();

  return {
    props: { encomendas, pecas },
  };
}
