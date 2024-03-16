export default function Footer() {
  return (
    <footer className='py-16 bg-neutral-100'>
      <div className='container'>
        <div className='flex items-center gap-10 flex-col lg:flex-row'>
          <img src='./src/assets/logo.svg' alt='' className='w-1/3 h-10' />

          <div className='flex items-center flex-col gap-5   lg:flex-row w-2/3'>
            <input
              type='text'
              placeholder='Nhập số điện thoại'
              className='text-black bg-gray-200 mr-4  p-4 w-full lg:w-4/5 border-none outline-none rounded-full focus:outline-primary'
            />
            <button className='w-full lg:w-1/5 p-4 uppercase text-white text-xs bg-primary hover:opacity-90 rounded-full transition-all'>
              Nhận ưu đãi
            </button>
          </div>
        </div>
        <div className='flex items-center justify-between gap-7 mt-14 flex-col lg:flex-row'>
          <div className=''>
            <span className='uppercase text-xl font-bold'>Cửa Hàng Hoa Quả Sạch Fuji Fruit Nha Trang</span>
            <div className='flex items-center gap-4 mt-5'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path
                  fillRule='evenodd'
                  d='m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
                  clipRule='evenodd'
                />
              </svg>
              <p>08 đường A1, KĐT Vĩnh Điềm Trung, xã Vĩnh Hiệp, Nha Trang, Vietnam</p>
            </div>
            <div className='flex items-center gap-4 mt-5'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path
                  fillRule='evenodd'
                  d='M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z'
                  clipRule='evenodd'
                />
              </svg>
              <p>1900 2268 - 0868 087 997</p>
            </div>
            <div className='flex items-center gap-4 mt-5'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path d='M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z' />
                <path
                  fillRule='evenodd'
                  d='M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3Z'
                  clipRule='evenodd'
                />
              </svg>
              <p className='italic'>Thời gian mở cửa: 7h30 – 21h30 (Cả T7, CN và ngày lễ)</p>
            </div>
          </div>
          <div className='flex item-center justify-between gap-10'>
            <div className=''>
              <h3 className='font-bold border-b-2'>HỖ TRỢ KHÁCH HÀNG</h3>
              <p className='mt-3 cursor-pointer hover:text-primary transition-all'>Về chúng tôi</p>
              <p className='mt-2 cursor-pointer hover:text-primary transition-all'>Chính sách hỗ trợ</p>
              <p className='mt-2 cursor-pointer hover:text-primary transition-all'>Cam kết</p>
              <p className='mt-2 cursor-pointer hover:text-primary transition-all'>Giải thưởng</p>
            </div>

            <div className=''>
              <h3 className='font-bold uppercase border-b-2'>Chính sách Fuji</h3>
              <p className='mt-3 cursor-pointer hover:text-primary transition-all'>Chính sách bảo hành</p>
              <p className='mt-2 cursor-pointer hover:text-primary transition-all'>Chính sách bảo mật</p>
              <p className='mt-2 cursor-pointer hover:text-primary transition-all'>Chính sách sử dụng</p>
              <p className='mt-2 cursor-pointer hover:text-primary transition-all'>Phương thức thanh toán</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
