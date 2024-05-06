/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react' // Import useState
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import orderApi from 'src/apis/order.api'
import { orderStatus } from 'src/contains/order'
import { path } from 'src/contains/path'
import useQueryParams from 'src/hooks/useQueryParams'
import { OrderListStatus } from 'src/types/order.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import axios from 'axios'
import Popup from 'src/components/Popup/Popup'

const orderTabs = [
  { status: orderStatus.all, name: 'Tất cả' }, // Add tab "Tất cả"
  { status: orderStatus.pending, name: 'Chờ xác nhận' },
  { status: orderStatus.success, name: 'Thành công' },
  { status: orderStatus.canceled, name: 'Đã hủy' }
]

export default function OrderHistory() {
  const queryParams: { status?: string } = useQueryParams()
  const [currentTab, setCurrentTab] = useState<'' | 'pending' | 'success' | 'canceled'>(orderStatus.all) // Update state type
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // K

  const status: string = String(queryParams.status) || orderStatus.all

  const { data: orderHistoryData, refetch } = useQuery({
    queryKey: ['orders', { status }],
    queryFn: () => orderApi.getOrders({ status: status as OrderListStatus })
  })

  const { data: orderAllHistoryData, refetch: refetAll } = useQuery({
    queryKey: ['orders', { status: 'all' }],
    queryFn: () => orderApi.getOrders()
  })

  const orderAllHistory = orderAllHistoryData?.data.data
  const orderHistory = orderHistoryData?.data.data

  console.log(orderAllHistory)
  console.log(orderHistory)

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const openPopup = () => {
    setIsPopupOpen(true)
  }
  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const purchaseTabsLink = orderTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.order,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-primary text-primary': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
      onClick={() => setCurrentTab(tab.status)} // Update current tab when clicked
    >
      {tab.name}
    </Link>
  ))

  // Display all orders if "Tất cả" tab is selected
  let filteredOrders
  if (currentTab === orderStatus.all) {
    filteredOrders = orderAllHistory
  } else {
    filteredOrders = orderHistory?.filter((order) => order.status === currentTab)
  }

  const updateOrderStatus = async (orderId: string) => {
    try {
      // Gửi yêu cầu PATCH đến API
      const response = await axios.patch(`http://127.0.0.1:8000/api/orders/${orderId}/cancel`, {
        status: 'success' // Trạng thái mới là 'access'
      })

      // Kiểm tra xem yêu cầu có thành công không
      if (response.status === 200 || response.status === 201) {
        console.log('Cập nhật trạng thái đơn hàng thành công')
        const responseData = response.data.message
        // Mở popup khi thành công
        // Cập nhật state với responseData
        setResponseData(responseData)
        openPopup()
        refetch()
        refetAll()
        // Thực hiện các hành động khác sau khi cập nhật thành công
      } else {
        console.error('Cập nhật trạng thái đơn hàng thất bại')
        // Xử lý lỗi nếu cần
      }
    } catch (error) {
      console.error('Lỗi:', error)
      // Xử lý lỗi nếu cần
    }
  }

  const handleCanceledStatus = (orderId: string) => async () => {
    await updateOrderStatus(orderId)
  }

  return (
    <div className='px-8'>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />

      <div className=' text-primary font-semibold uppercase py-6 '>Lịch sử đơn hàng</div>
      <div className='overflow-x-auto '>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          <div>
            {filteredOrders &&
              filteredOrders.map((order) => (
                <div key={order.id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-lg'>
                  {order.items.map((item, index) => (
                    <div key={item.id}>
                      <Link
                        to={`${path.products}${generateNameId({ name: item.product.name, id: item.product.id })}`}
                        className='flex'
                      >
                        <div className='flex-shrink-0'>
                          <img
                            className='h-20 w-20 object-cover'
                            src={`/src/assets/images/products/${item.product.image}`}
                            alt={item.product.name}
                          />
                        </div>
                        <div className='ml-3 flex-grow overflow-hidden'>
                          <div className='truncate'>{item.product.name}</div>
                          <div className='mt-3'>x{item.quantity}</div>
                          <div
                            className={`mt-3 ${
                              order.status === 'pending'
                                ? 'text-blue-100'
                                : order.status === 'success'
                                  ? 'text-green-300'
                                  : 'text-red-200'
                            }`}
                          >
                            {order.status === 'pending'
                              ? 'Đang xử lí'
                              : order.status === 'success'
                                ? 'Thành công'
                                : 'Đã hủy'}
                          </div>
                        </div>
                        <div className='ml-3 flex-shrink-0'>
                          <span className='truncate text-gray-500 line-through'>
                            ₫{formatCurrency(item.product.price_before_discount)}
                          </span>
                          <span className='ml-2 truncate text-primary'>₫{formatCurrency(item.product.price)}</span>
                        </div>
                      </Link>
                      <div className='flex justify-end mb-2'>
                        <div>
                          <span>Tổng giá tiền</span>
                          <span className='ml-4 text-xl text-primary'>
                            ₫{formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      {index === order.items.length - 1 && (
                        // Kiểm tra có ít nhất hai mục trong đơn hàng
                        <div className='flex justify-end'>
                          <div>
                            <span>Tổng thanh toán</span>
                            <span className='ml-4 text-xl text-primary'>₫{formatCurrency(order.total_amount)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {order.status === 'pending' && currentTab !== '' && (
                    <button
                      onClick={openDeleteModal}
                      type='button'
                      data-modal-target='deleteModal'
                      data-modal-toggle='deleteModal'
                      className='flex  items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400'
                    >
                      <svg
                        className='w-4 h-4 mr-2'
                        viewBox='0 0 14 15'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-hidden='true'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          fill='currentColor'
                          d='M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z'
                        />
                      </svg>
                      Hủy đơn hàng
                    </button>
                  )}
                  {/* <!-- Delete modal --> */}
                  {isDeleteModalOpen && currentTab.includes('pending') && (
                    <div
                      id='deleteModal'
                      tabIndex={-1}
                      aria-hidden='true'
                      className={`${!isDeleteModalOpen ? 'hidden' : ''} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex  inset-0 bg-gray-800 bg-opacity-80`}
                    >
                      <div className='relative p-4 w-full max-w-md max-h-full'>
                        {/* <!-- Modal content --> */}
                        <div className='relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
                          <button
                            onClick={closeDeleteModal}
                            type='button'
                            className='text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                            data-modal-toggle='deleteModal'
                          >
                            <svg
                              aria-hidden='true'
                              className='w-5 h-5'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span className='sr-only'>Close modal</span>
                          </button>
                          <svg
                            className='text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto'
                            aria-hidden='true'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              fillRule='evenodd'
                              d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                              clipRule='evenodd'
                            />
                          </svg>
                          <p className='mb-4 text-gray-500 dark:text-gray-300'>Bạn có muốn hủy đơn hàng này?</p>
                          <div className='flex justify-center items-center space-x-4'>
                            <button
                              data-modal-toggle='deleteModal'
                              type='button'
                              className='py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600'
                            >
                              Không, hủy
                            </button>
                            <button
                              onClick={handleCanceledStatus(order.id)}
                              type='submit'
                              className='py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900'
                            >
                              Có, Tôi muốn hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
