import { Routes, Route } from 'react-router-dom'
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid'
import { Navbar, Footer } from '@/widgets/layout'
import routes from '@/routes'

export function Auth() {
  const navbarRoutes = [
    {
      name: 'dashboard',
      path: '/dashboard/home',
      icon: ChartPieIcon,
    },
    {
      name: 'profile',
      path: '/dashboard/home',
      icon: UserIcon,
    },
    {
      name: 'sign up',
      path: '/auth/sign-up',
      icon: UserPlusIcon,
    },
    {
      name: 'sign in',
      path: '/auth/sign-in',
      icon: ArrowRightOnRectangleIcon,
    },
  ]

  return (
    <div className="relative w-full min-h-screen">
      <div className="container relative z-40 p-4 mx-auto">
        <Navbar routes={navbarRoutes} />
      </div>
      <Routes>
        {routes.map(
          ({ layout, pages }) =>
            layout === 'auth' &&
            pages.map(({ path, element }) => (
              <Route exact path={path} element={element} />
            ))
        )}
      </Routes>
      <div className="container absolute z-10 mx-auto text-white bottom-8 left-2/4 -translate-x-2/4">
        <Footer />
      </div>
    </div>
  )
}

Auth.displayName = '/src/layout/Auth.jsx'

export default Auth
