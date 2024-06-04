import { Fragment } from 'react'
import Menu from './menu'
import TopBar from './topbar'

function Layout(props) {
  return (
    <Fragment>
      <div className="flex h-screen">
        <Menu />
        <div className="flex-grow flex flex-col h-100 ">
          <TopBar />
          <div className="flex-grow p-8 bg-gray-100 overflow-auto">
            {props.children}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Layout
