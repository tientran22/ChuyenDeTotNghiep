import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import AdminApi from 'src/apis/admin.api'
import { getOrderStatus } from 'src/helper'
import { Order } from 'src/types/order.type'
import { formatCurrency } from 'src/utils/utils'

export default function RecentOrders() {
  const { data: recentOrdersData } = useQuery({
    queryKey: ['RecentOrders'],
    queryFn: () => AdminApi.getRecentOrders()
  })
  if (!recentOrdersData) return null
  return (
    <div className='bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1'>
      <strong className='text-gray-700 font-medium'>Đơn hàng gần nhất</strong>
      <div className='border-x border-gray-200 rounded-sm mt-3'>
        <table className='w-full text-gray-700'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên khách hàng</th>
              <th>Địa chỉ giao hàng</th>
              <th>Tổng thanh toán</th>
              <th>Trạng thái</th>
              {/* <th>Lưu ý</th> */}
            </tr>
          </thead>
          <tbody>
            {recentOrdersData.data.recent_orders.map((order: Order) => (
              <tr key={order.id}>
                <td>
                  <Link className='text-sky-500 hover:underline' to={`/order/${order.id}`}>
                    #{order.id}
                  </Link>
                </td>
                <td>
                  <Link className='text-sky-500 hover:underline' to={`/product/${order.name}`}>
                    #{order.name}
                  </Link>
                </td>
                <td>{order.delivery_address}</td>
                <td className='text-primary font-semibold'>₫{formatCurrency(order.total_amount)}</td>
                <td>{getOrderStatus(order.status)}</td>
                {/* <td>{order.note}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
