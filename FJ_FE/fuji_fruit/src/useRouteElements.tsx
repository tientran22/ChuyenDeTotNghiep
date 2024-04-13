/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import ProductList from './pages/ProductsList'
import Register from './pages/Register'
import Login from './pages/Login'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import { path } from './contains/path'
import Admin from './pages/Admin'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Blog from './pages/Blog'
import Contact from './pages/Contact/Contact'
import BlogDetail from './pages/BlogDetail'
import AdminLayout from './layouts/AdminLayout'
import AdminProducts from './pages/AdminProducts'
import Payment from './pages/Payment'
import Thankyou from './pages/Thankyou'
import SingIn from './components/SingIn'
import GoogleCallback from './components/GoogleCallback'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

function AdminRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)

  // Kiểm tra nếu người dùng đã xác thực, là admin và không có vai trò là "user" thì cho phép truy cập trang admin,
  // ngược lại chuyển hướng về trang chính
  if (isAuthenticated && profile?.roles.includes('admin')) {
    return <Outlet />
  } else {
    return <Navigate to='/' />
  }
}

function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: '/si',
      element: (
        <MainLayout>
          <SingIn />
        </MainLayout>
      )
    },
    {
      path: path.products,
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },

    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },

    {
      path: path.blog,
      element: (
        <MainLayout>
          <Blog />
        </MainLayout>
      )
    },

    {
      path: path.blogDetail,
      element: (
        <MainLayout>
          <BlogDetail />
        </MainLayout>
      )
    },
    {
      path: path.contact,
      element: (
        <MainLayout>
          <Contact />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        },
        {
          path: path.cart,
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          )
        },
        {
          path: path.payment,
          element: (
            <MainLayout>
              <Payment />
            </MainLayout>
          )
        },
        {
          path: path.thankYou,
          element: (
            <MainLayout>
              <Thankyou />
            </MainLayout>
          )
        }
      ]
    },

    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },

    {
      path: '',
      element: <AdminRoute />,
      children: [
        {
          path: path.admin,
          element: (
            <AdminLayout>
              <Admin />
            </AdminLayout>
          )
        },
        {
          path: path.adminProduct,
          element: (
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          )
        }
      ]
    }
  ])
  return routeElements
}

export default useRouteElements
