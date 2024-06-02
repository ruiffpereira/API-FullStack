import { Fragment } from "react";
import Orders from "./orders";
import Products from "./products";
import { redirect } from "next/dist/server/api-utils";
import { notFound } from "next/navigation";

function Ecommerce(props) {
  return (
    <Fragment>
      {/* <Orders orders={props.orders}/> */}
      <Products products={props.products}/>
    </Fragment>
  );
}

export default Ecommerce;

export async function getServerSideProps() {

  try {
    const res = await fetch('http://localhost:3001/products');
    const products = await res.json();
    return {
      props: { products },
    };
  } catch (error) {
    console.log("error: " + error);

    return {
      notFound: true,
    }
  }
  

 

  // const res1 = await fetch('http://localhost:3001/product');
  // const products = await res1.json();

  
}
