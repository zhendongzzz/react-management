import { Navigate } from 'react-router-dom'

// 导入路由组件
import Home from '../pages/Home'
import Bar from '../pages/Bar'
import Category from '../pages/Category'
import Line from '../pages/Line'
import Pie from '../pages/Pie'
import Product from '../pages/Product'
import Role from '../pages/Role'
import User from '../pages/User'

const routes = [
  { path: '/', element: <Navigate to="/home" /> },
  { path: '/home', element: <Home /> },
  { path: '/table/bar', element: <Bar /> },
  { path: '/goods/category', element: <Category /> },
  { path: '/table/line', element: <Line /> },
  { path: '/table/pie', element: <Pie /> },
  { path: '/goods/product/*', element: <Product /> },
  { path: '/role', element: <Role /> },
  { path: '/user', element: <User /> }
]

export default routes
