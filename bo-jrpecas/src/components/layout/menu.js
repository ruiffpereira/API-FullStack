import Link from 'next/link'
import { Fragment } from 'react'

function Menu() {
  return (
    <Fragment>
      <div className="flex-shrink-0 w-60 border-r border-gray-200 flex flex-col gap-2 p-4 text-left">
        <Link
          href="/dashboard"
          className="text-ellipsis text-base text-left hover:bg-blue-500 hover:text-white transition ease-in duration-200 p-4 rounded"
        >
          Dashboard
        </Link>
        <Link
          href="/ecommerce"
          className="text-ellipsis text-base text-left hover:bg-blue-500 hover:text-white transition ease-in duration-200 p-4 rounded"
        >
          eCommerce
        </Link>
        <Link
          href="/customers"
          className="text-ellipsis text-base text-left hover:bg-blue-500 hover:text-white transition ease-in duration-200 p-4 rounded"
        >
          Clients
        </Link>
        <Link
          href="/settings"
          className="text-ellipsis text-base text-left hover:bg-blue-500 hover:text-white transition ease-in duration-200 p-4 rounded"
        >
          Settings
        </Link>
      </div>
    </Fragment>
  )
}

export default Menu
