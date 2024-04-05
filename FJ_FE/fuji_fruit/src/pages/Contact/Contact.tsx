import React from 'react'

export default function Contact() {
  return (
    <div className='bg-white py-16'>
      <div className='container'>
        <div className='border-b border-gray-200'>
          <div className='font-semibold text-primary'>Địa chỉ cửa hàng</div>
          <div className=' mt-4 pl-6 font-bold'>08 đường A1, KĐT Vĩnh Điềm Trung, xã Vĩnh Hiệp, Nha Trang, Vietnam</div>
          <div className=' mt-4 pl-6 italic'>Thời gian mở cửa: 7h30 – 21h30 (Cả T7, CN và ngày lễ)</div>
          <div className=' mt-4 font-semibold text-primary'>Hỗ trợ khách hàng</div>
          <div className=' mt-4 pl-6 font-bold '>
            Hotline: <span className='text-primary'>086 808 7997</span>
          </div>
          <div className=' my-4 pl-6 font-bold'>
            Email: <span className='font-medium '>contact@fujifruit.vn</span>
          </div>
        </div>
        <div>
          <img src='/src/assets/fuji.png' alt='' className='w-full h-full object-cover' />
        </div>
      </div>
    </div>
  )
}
