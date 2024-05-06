/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */

import { useMutation, useQuery } from '@tanstack/react-query'
import React, { ChangeEvent, useState } from 'react'
import AdminOrderApi from 'src/apis/adminOrder.api'

import Button from 'src/components/Button'

import Popup from 'src/components/Popup/Popup'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/products.type'

interface Props {
  isModalOpen: boolean
  closeModal: () => void
}

export default function FormCreateOrder({ isModalOpen, closeModal }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    delivery_address: '',
    total_amount: 0,
    status: '',
    note: '',
    user_id: ''
  })

  const [value, setValue] = useState<number | ''>('')

  // Hàm xử lý khi giá trị thay đổi
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = event.target.value
    const numericValue: number = parseInt(inputValue.replace(/\D/g, ''), 10)
    setValue(numericValue)
  }

  // Hàm định dạng số
  const formatNumber = (input: number): string => {
    // Định dạng số theo ý của bạn, ví dụ: phân tách hàng nghìn bằng dấu ","
    return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const queryConfig = useQueryConfig()

  const { data: adminOrderData, refetch } = useQuery({
    queryKey: ['adminOrders', queryConfig],
    queryFn: () => AdminOrderApi.getOrders(queryConfig as ProductListConfig)
  })
  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const Ordermutation = useMutation({
    mutationFn: (body: {
      name: string
      phone_number: string
      delivery_address: string
      total_amount: number | ''
      status: string
      user_id: string
      note: string
    }) => AdminOrderApi.createOrders(body)
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Gửi dữ liệu lên server
    e.preventDefault()
    Ordermutation.mutate(
      {
        name: formData.name,
        phone_number: formData.phone_number,
        delivery_address: formData.delivery_address,
        total_amount: value,
        status: formData.status,
        user_id: formData.user_id,
        note: formData.note
      },
      {
        onSuccess: (data) => {
          closeModal()
          const responseData = data.data.message
          console.log(data.data.message)
          // Mở popup khi thành công
          // Cập nhật state với responseData
          setResponseData(responseData)
          openPopup()
          refetch()
        },
        onError: (error) => {
          console.log(error)
          // Xử lý và hiển thị thông báo lỗi lên giao diện
        }
      }
    )
  }
  return (
    <div>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />
      {isModalOpen && (
        <div
          id='createProductModal'
          tabIndex={-1}
          aria-hidden='true'
          className={`${!isModalOpen ? 'hidden' : ''} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex  inset-0 bg-gray-800 bg-opacity-80`}
        >
          <div className='relative p-4 w-full max-w-2xl max-h-full'>
            {/* <!-- Modal content --> */}
            <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              {/* <!-- Modal header --> */}
              <div className='flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Thêm đơn hàng</h3>
                <button
                  type='button'
                  onClick={closeModal}
                  className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                  data-modal-target='createProductModal'
                  data-modal-toggle='createProductModal'
                >
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clip-rule='evenodd'
                    />
                  </svg>
                  <span className='sr-only'>Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <form action='#' onSubmit={onSubmit}>
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
                      <option className='bg-white text-black'>pending</option>
                      <option className='bg-white text-black'>success</option>
                      <option className='bg-white text-black'>canceled</option>
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
                      value={value === '' ? '' : formatNumber(value)}
                      onChange={handleChange}
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
                <div className='flex justify-end mt-4'>
                  <Button
                    disabled={Ordermutation.isPending}
                    isLoading={Ordermutation.isPending}
                    type='submit'
                    className='text-white inline-flex items-center  bg-primary hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                  >
                    Thêm đơn hàng
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
