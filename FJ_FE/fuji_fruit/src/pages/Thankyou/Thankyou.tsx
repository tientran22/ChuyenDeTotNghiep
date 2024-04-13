import React from 'react'
import { Link } from 'react-router-dom'
import { path } from 'src/contains/path'

export default function Thankyou() {
  return (
    <div className='flex justify-center items-center py-10'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-20 h-20 text-primary mx-auto'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
          />
        </svg>
        <h2 className='text-3xl font-bold mb-4 text-center'>Cảm ơn bạn vì đã mua hàng!</h2>
        <p className='text-lg text-gray-700'>
          Chúng tôi đã nhận được thông tin của bạn và sẽ xử lý trong thời gian sớm nhất.
        </p>
        <div className='mt-6 text-center'>
          <Link to={path.home} className='text-blue-600 hover:underline'>
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
