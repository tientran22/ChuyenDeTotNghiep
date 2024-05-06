/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import AdminOrderApi from 'src/apis/adminOrder.api'

import Popup from 'src/components/Popup/Popup'

import { Order, OrderList } from 'src/types/order.type'

import { SuccessResponse } from 'src/types/utils.type'
interface Props {
  selectedItemId: string
  isEditModalOpen: boolean
  closeEditModal: () => void
  refetchAdminUsers: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<SuccessResponse<OrderList>>, Error>>
  orderData: Order | undefined
}
export default function FormEditUser({
  isEditModalOpen,
  closeEditModal,
  selectedItemId,
  refetchAdminUsers,
  orderData
}: Props) {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    delivery_address: '',
    total_amount: 0,
    status: '',
    note: '',
    user_id: ''
  })
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData.

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  // Hàm định dạng số
  const formatNumber = (input: number): string => {
    // Định dạng số theo ý của bạn, ví dụ: phân tách hàng nghìn bằng dấu ","
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  useEffect(() => {
    if (orderData) {
      setFormData({
        name: orderData.name,
        phone_number: orderData.phone_number,
        delivery_address: orderData.delivery_address,
        total_amount: orderData.total_amount,
        status: orderData.status,
        note: orderData.note,
        user_id: orderData.user_id
      })
    }
  }, [orderData])

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const EditOrdermutation = useMutation({
    mutationFn: (body: {
      name?: string
      phone_number?: string
      delivery_address?: string
      total_amount?: number | ''
      status?: string
      user_id?: string
      note?: string
    }) => AdminOrderApi.editOrders(selectedItemId, body)
  })
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Gửi dữ liệu lên server
    e.preventDefault()
    EditOrdermutation.mutate(
      {
        name: formData.name,
        phone_number: formData.phone_number,
        delivery_address: formData.delivery_address,
        total_amount: formData.total_amount,
        status: formData.status,
        user_id: formData.user_id,
        note: formData.note
      },
      {
        onSuccess: (data) => {
          closeEditModal()
          const responseData = data.data.message

          // Mở popup khi thành công
          // Cập nhật state với responseData
          setResponseData(responseData)
          openPopup()
          refetchAdminUsers()
        },
        onError: (data) => {
          console.log(data)
        }
      }
    )
  }
  return (
    <div>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />
      {isEditModalOpen && (
        <div
          id='updateProductModal'
          tabIndex={-1}
          aria-hidden='true'
          className={`${!isEditModalOpen ? 'hidden' : ''} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex  inset-0 bg-gray-800 bg-opacity-80`}
        >
          <div className='relative p-4 w-full max-w-2xl max-h-full'>
            {/* <!-- Modal content --> */}
            <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              {/* <!-- Modal header --> */}
              <div className='flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Sửa thông tin đơn hàng</h3>
                <button
                  onClick={closeEditModal}
                  type='button'
                  className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                  data-modal-toggle='updateProductModal'
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
              </div>
              {/* <!-- Modal body --> */}
              <form onSubmit={handleEditSubmit}>
                <div className='grid gap-4 mb-4 sm:grid-cols-2'>
                  <div>
                    <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Tên khách hàng
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Tên người dùng'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='phone_number'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Số điện thoại
                    </label>
                    <input
                      type='text'
                      name='phone_number'
                      id='phone_number'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Nhập số điện thoại'
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor='delivery_address'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Địa chỉ giao hàng
                    </label>
                    <input
                      type='delivery_address'
                      name='delivery_address'
                      id='delivery_address'
                      placeholder='Địa chỉ giao hàng'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      value={formData.delivery_address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor='status' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Trạng thái
                    </label>

                    <select
                      name='status'
                      value={formData.status || ''}
                      onChange={handleInputChange}
                      defaultValue='default'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    >
                      <option value='' disabled className='bg-white text-black'>
                        Trạng thái
                      </option>
                      <option className='bg-white text-black'>Đang xử lí</option>
                      <option className='bg-white text-black'>Thành công</option>
                      <option className='bg-white text-black'>Đã hủy</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor='total_amount'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Tổng tiền đơn hàng
                    </label>
                    <input
                      type='text'
                      name='total_amount'
                      id='total_amount'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Nhập số tiền'
                      value={formatNumber(formData.total_amount)}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor='user_id' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Id người dùng
                    </label>
                    <input
                      type='text'
                      name='user_id'
                      id='user_id'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='id người dùng'
                      value={formData.user_id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className='sm:col-span-2'>
                  <label htmlFor='note' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                    Lưu ý
                  </label>
                  <textarea
                    id='note'
                    name='note'
                    value={formData.note}
                    onChange={handleInputChange}
                    rows={4}
                    className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    placeholder='Nhập lưu ý vào đây'
                  ></textarea>
                </div>
                <div className='flex items-center space-x-4 mt-4'>
                  <button
                    type='submit'
                    className='bg-primary text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                  >
                    Sửa đơn hàng
                  </button>
                  <button
                    type='button'
                    className='text-red-600 inline-flex items-center  hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                  >
                    <svg
                      className='mr-1 -ml-1 w-5 h-5'
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
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* <!-- Read modal --> */}
    </div>
  )
}
