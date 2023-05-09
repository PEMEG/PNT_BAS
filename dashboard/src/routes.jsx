import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  DocumentIcon,
  CreditCardIcon,
} from '@heroicons/react/24/solid'
import { Home, Profile, Tables, Notifications } from '@/pages/dashboard'
import { SignIn, SignUp } from '@/pages/auth'
import Rooms from './pages/dashboard/rooms'
import Readings from './pages/dashboard/readings'
import ReadingsEditor from './pages/dashboard/readings-editor'
import Invoices from './pages/dashboard/invoices'
import Settlement from './pages/dashboard/settlement'

const icon = {
  className: 'w-5 h-5 text-inherit',
}

export const routes = [
  {
    layout: 'dashboard',
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: 'dashboard',
        path: '/home',
        element: <Home />,
      },
      // {
      //   icon: <UserCircleIcon {...icon} />,
      //   name: 'profile',
      //   path: '/profile',
      //   element: <Profile />,
      // },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: 'tables',
      //   path: '/tables',
      //   element: <Tables />,
      // },
      {
        icon: <BuildingOffice2Icon {...icon} />,
        name: 'pomieszczenia',
        path: '/pomieszczenia',
        element: <Rooms />,
      },
      {
        icon: <ChartBarIcon {...icon} />,
        name: 'odczyty',
        path: '/odczyty',
        element: <Readings />,
      },
      {
        icon: <DocumentIcon {...icon} />,
        name: 'faktury',
        path: '/faktury',
        element: <Invoices />,
      },
      {
        icon: <CreditCardIcon {...icon} />,
        name: 'Rozliczenia',
        path: '/rozliczenia',
        element: <Settlement />,
      },
      // {
      //   icon: <BellIcon {...icon} />,
      //   name: 'notifactions',
      //   path: '/notifactions',
      //   element: <Notifications />,
      // },
    ],
  },
  // {
  //   title: "auth pages",
  //   layout: "auth",
  //   pages: [
  //     {
  //       icon: <ArrowRightOnRectangleIcon {...icon} />,
  //       name: "sign in",
  //       path: "/sign-in",
  //       element: <SignIn />,
  //     },
  //     {
  //       icon: <UserPlusIcon {...icon} />,
  //       name: "sign up",
  //       path: "/sign-up",
  //       element: <SignUp />,
  //     },
  //   ],
  // },
]

export default routes
