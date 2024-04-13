/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import orderApi from 'src/apis/order.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { path } from 'src/contains/path'
import { Order, OrderItem } from 'src/types/order.type'
import { Purchase } from 'src/types/purchase.type'
import { paymentSchema } from 'src/utils/rules'

import { formatCurrency } from 'src/utils/utils'

type FormData = Pick<paymentSchema, 'name' | 'delivery_address' | 'phone_number' | 'note'>

export default function Payment() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location

  const { checkedPurchases, totalCheckedPurchasePrice } = state
  const [formData, setFormData] = useState<Order>({
    name: '',
    delivery_address: '',
    phone_number: '',
    total_amount: totalCheckedPurchasePrice as number,
    note: '',
    items: checkedPurchases.map((purchase: Purchase) => ({
      product_id: purchase.product.id,
      quantity: purchase.buy_count,
      price: purchase.product.price * purchase.buy_count
    }))
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(paymentSchema)
  })

  // Tạo mutation function để gửi dữ liệu lên server
  const Ordermutation = useMutation({
    mutationFn: (body: {
      name: string
      phone_number: string
      delivery_address: string
      total_amount: number
      note?: string
      items: OrderItem[]
    }) => orderApi.orderProducts(body)
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log(value)
    console.log(name)
    setFormData({ ...formData, [name]: value })
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setFormData({
      ...formData,
      note: newValue
    })
  }

  const onSubmit = handleSubmit(() => {
    // Gửi dữ liệu lên server
    Ordermutation.mutate(
      {
        name: formData.name,
        phone_number: formData.phone_number,
        delivery_address: formData.delivery_address,
        note: formData.note,
        total_amount: formData.total_amount,
        items: checkedPurchases.map((purchase: Purchase) => ({
          product_id: purchase.product.id,
          quantity: purchase.buy_count,
          price: purchase.product.price * purchase.buy_count
        }))
      },
      {
        onSuccess: () => {
          navigate(path.thankYou)
        }
      }
    )
  })

  return (
    <div className='bg-white pt-16'>
      <div className='container'>
        <div className='font-semibold text-4xl border-b border-gray-200 text-primary mb-4'>Thanh toán</div>
        <form className='px-8 pt-6 pb-8 mb-4' onSubmit={onSubmit} noValidate>
          <div className='grid grid-cols-12 gap-10'>
            <div className='col-span-6'>
              <div className='border-b border-gray-200 uppercase pb-4 mb-4'>Thông tin thanh toán</div>
              <div className='w-full'>
                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                    Tên <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    placeholder='Tên'
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    errorMessage={errors.name?.message}
                    register={register}
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='address'>
                    Địa chỉ nhận hàng <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    placeholder='Địa chỉ'
                    type='text'
                    name='delivery_address'
                    value={formData.delivery_address}
                    errorMessage={errors.delivery_address?.message}
                    onChange={handleChange}
                    register={register}
                  />
                </div>
                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='phone'>
                    Số điện thoại <span className='text-red-500'>*</span>
                  </label>
                  <Input
                    placeholder='Số điện thoại'
                    name='phone_number'
                    type='phone'
                    value={formData.phone_number}
                    errorMessage={errors.phone_number?.message}
                    onChange={handleChange}
                    register={register}
                  />
                </div>

                <div className='mb-4'>
                  <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='note'>
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    onChange={handleNoteChange}
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    id='note'
                    placeholder='Nhập ghi chú (tuỳ chọn)'
                    rows={5}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className='col-span-6'>
              <div className='border-b border-gray-200 uppercase pb-4 mb-4'>Đơn hàng của bạn</div>
              <div className='flex items-center justify-between p-6 bg-neutral-100'>
                <div className='uppercase'>Sản phẩm</div>
                <div className='uppercase'>Tạm tính</div>
              </div>
              {/* Duyệt qua mỗi sản phẩm và hiển thị thông tin */}
              {checkedPurchases.map((purchase: Purchase) => (
                <div key={purchase.id} className='flex items-center justify-between p-6'>
                  <div>
                    {purchase.product.name} × {purchase.buy_count}
                  </div>
                  <div className='text-primary'>{formatCurrency(purchase.product.price * purchase.buy_count)}₫</div>
                </div>
              ))}
              <div className='flex items-center justify-between mb-2 pr-6 gap-2'>
                <div className='uppercase flex-grow p-6 bg-neutral-100'>Tạm tính</div>
                <div className='uppercase text-primary'>{formatCurrency(totalCheckedPurchasePrice)}₫</div>
              </div>
              <div className='flex items-center justify-between pr-6 gap-2'>
                <div className='uppercase flex-grow p-6 bg-neutral-100'>Tổng</div>
                <div className='uppercase text-primary font-semibold'>{formatCurrency(totalCheckedPurchasePrice)}₫</div>
              </div>
              <div className='flex items-center gap-2 mt-4 p-6 bg-neutral-100 font-semibold'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z'
                  />
                </svg>
                Thanh toán khi nhận hàng
              </div>
              <Button
                type='submit'
                className='w-full mt-4 p-3 uppercase text-white text-xs bg-primary hover:bg-primary/80 rounded-sm transition-all flex items-center justify-center'
                disabled={Ordermutation.isPending}
                isLoading={Ordermutation.isPending}
              >
                Đặt hàng
              </Button>
            </div>
            {/* Phần phương thức thanh toán */}
            <div className='col-span-6'>{/* Phần phương thức thanh toán */}</div>
          </div>
        </form>
      </div>
    </div>
  )
}
