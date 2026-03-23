import { Outlet } from 'react-router-dom'
import LeftHome from './LeftHome'
import Navbar from './Navbar'

// Shared layout for all authenticated pages.
// Renders the fixed LeftHome sidebar (desktop only), the mobile Navbar, and outlets child page content.
const AppLayout = () => {
  return (
    <>
      <LeftHome />
      <Navbar />
      <Outlet />
    </>
  )
}

export default AppLayout
