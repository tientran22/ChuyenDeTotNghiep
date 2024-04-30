import {
  HiOutlineViewGrid,
  HiOutlineCube,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineAnnotation,
  HiOutlineQuestionMarkCircle,
  HiOutlineCog,
  HiOutlineCollection,
  HiOutlineLightBulb
} from 'react-icons/hi'

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: 'dashboard',
    label: 'Quản trị',
    path: '/admin',
    icon: <HiOutlineViewGrid />
  },
  {
    key: 'products',
    label: 'Sản phẩm',
    path: '/admin/products',
    icon: <HiOutlineCube />
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    path: '/admin/orders',
    icon: <HiOutlineShoppingCart />
  },
  {
    key: 'users',
    label: 'Người dùng',
    path: '/admin/users',
    icon: <HiOutlineUsers />
  },

  {
    key: 'blog',
    label: 'Tin tức',
    path: '/admin/blogs',
    icon: <HiOutlineAnnotation />
  },
  {
    key: 'categories',
    label: 'Danh mục',
    path: '/admin/categories',
    icon: <HiOutlineCollection />
  },
  {
    key: 'brands',
    label: 'Thương hiệu',
    path: '/admin/brands',
    icon: <HiOutlineLightBulb />
  }
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    key: 'settings',
    label: 'Cài đặt',
    path: '/settings',
    icon: <HiOutlineCog />
  },
  {
    key: 'support',
    label: 'Hỗ trợ',
    path: '/support',
    icon: <HiOutlineQuestionMarkCircle />
  }
]
