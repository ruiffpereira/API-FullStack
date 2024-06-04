function Client(props) {
  return <h1>{props.name.name}</h1>
}

export default Client

export async function getServerSideProps(context) {
  const name = context.query
  return { props: { name } }
}
