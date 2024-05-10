import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { path } from 'src/contains/path'
import Popover from '../Popover'
import classNames from 'classnames'
import { useContext, useEffect, useState } from 'react'
import { formatCurrency } from 'src/utils/utils'
import { useQuery } from '@tanstack/react-query'
import { purchaseStatus } from 'src/contains/purchase'
import purchaseApi from 'src/apis/purchase.api'
import { AppContext } from 'src/contexts/app.context'
export default function Navbar() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const MAX_PRODUCT = 5
  const { isAuthenticated } = useContext(AppContext)
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.pageYOffset
      setIsScrolled(scrollTop > 190)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav
      className={classNames('py-6 bg-white w-full shadow-xl', {
        'fixed top-0 z-50': isScrolled,
        relative: !isScrolled
      })}
    >
      <div className='max-w-7xl mx-auto  grid grid-cols-12'>
        <div className='col-span-3  flex items-center justify-center'>
          <Popover
            className='flex items-center  cursor-pointer '
            renderPopover={
              <div className='relative rounded-sm border border-gray-200 bg-white  shadow-md min-w-[300px]'>
                <button
                  onClick={() => {
                    navigate({
                      pathname: path.products,
                      search: createSearchParams({
                        category: '2',
                        brand: '2'
                      }).toString()
                    })
                  }}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100  hover:text-primary border-b border-gray-300'
                >
                  Trái cây nhập khẩu
                </button>
                <button
                  onClick={() => {
                    navigate({
                      pathname: path.products,
                      search: createSearchParams({
                        category: '2',
                        brand: '1'
                      }).toString()
                    })
                  }}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100  hover:text-primary border-b border-gray-300'
                >
                  Trái cây nội địa
                </button>
                <button
                  onClick={() => {
                    navigate({
                      pathname: path.products,
                      search: createSearchParams({
                        category: '1'
                      }).toString()
                    })
                  }}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100  hover:text-primary border-b border-gray-300'
                >
                  Giỏ quà tặng
                </button>
                <button
                  onClick={() => {
                    navigate({
                      pathname: path.products,
                      search: createSearchParams({
                        category: '3'
                      }).toString()
                    })
                  }}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100  hover:text-primary'
                >
                  Trái cây sấy
                </button>
              </div>
            }
          >
            <div className='px-2 py-2 bg-primary rounded-xl text-white w-full'>
              <Link to='/products' className='font-bold uppercase flex items-center justify-center'>
                <svg viewBox='0 0 12 10' className='mr-3 h-5 w-5 fill-current'>
                  <g fillRule='evenodd' stroke='none' strokeWidth={1}>
                    <g transform='translate(-373 -208)'>
                      <g transform='translate(155 191)'>
                        <g transform='translate(218 17)'>
                          <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                          <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                          <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                <span className='hidden md:block'>Danh mục sản phẩm</span>
              </Link>
            </div>
          </Popover>
        </div>
        <div className='col-span-7 flex items-center justify-center'>
          {/* Link routes ở phía giữa */}
          <div className='flex items-center justify-center gap-5 md:gap-10'>
            <Link
              to={path.home}
              className={classNames(
                'md:text-xl hover:text-primary transform transition-transform hover:scale-x-105',
                { 'font-bold text-primary': location.pathname === path.home } // Thêm lớp font-bold nếu liên kết là trang chủ
              )}
            >
              Trang chủ
            </Link>

            <Link
              to={path.products}
              className={classNames(
                'md:text-xl hover:text-primary transform transition-transform hover:scale-x-105',
                { 'font-bold text-primary': location.pathname === path.products } // Thêm lớp font-bold nếu liên kết là trang chủ
              )}
            >
              Sản phẩm
            </Link>
            <Link
              to={path.blog}
              className={classNames(
                'md:text-xl hover:text-primary transform transition-transform hover:scale-x-105',
                { 'font-bold text-primary': location.pathname === path.blog } // Thêm lớp font-bold nếu liên kết là trang chủ
              )}
            >
              Tin tức
            </Link>
            <Link
              to={path.contact}
              className={classNames(
                'md:text-xl hover:text-primary transform transition-transform hover:scale-x-105',
                { 'font-bold text-primary': location.pathname === path.contact } // Thêm lớp font-bold nếu liên kết là trang chủ
              )}
            >
              Liên hệ
            </Link>
          </div>
        </div>
        <div className='col-span-2'>
          <div className='flex items-center justify-center'>
            <Popover
              className='bg-white border-2 max-w-[500px] border-green-700 rounded-full p-3 hover:bg-primary hover:text-white transition-all '
              renderPopover={
                <div className='relative rounded-sm border border-gray-200 bg-white shadow-md text-sm p-2 '>
                  {purchasesInCart && purchasesInCart.length > 0 ? (
                    <div className='p-2'>
                      <div className='capitalize text-gray-400 mb-2'>Sản phẩm mới thêm</div>
                      {purchasesInCart.slice(0, MAX_PRODUCT).map((purchase) => (
                        <div className='mt-3 hover:bg-slate-100' key={purchase.id}>
                          <div className='flex items-center p-1 cursor-pointer'>
                            <img
                              src={`./src/assets/images/products/${purchase.product.image}`}
                              alt={purchase.product.name}
                              className='w-8 h-8 object-cover flex-shrink-0'
                            />
                            <div className='truncate mx-2 flex-grow'>{purchase.product.name}</div>
                            <span className='text-primary'>₫{formatCurrency(purchase.product.price)}</span>
                          </div>
                        </div>
                      ))}
                      <div className='flex items-center justify-between gap-2 mt-2'>
                        <div>
                          <span className='text-primary mr-1'>
                            {purchasesInCart.length > MAX_PRODUCT ? purchasesInCart.length - MAX_PRODUCT : ''}
                          </span>
                          <span className='text-gray-700'>Thêm vào giỏ hàng </span>
                        </div>

                        <Link
                          to={path.cart}
                          className='rounded-sm outline-none border-none px-3 py-2 bg-primary text-white hover:opacity-90'
                        >
                          Xem giỏ hàng
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className='p-2 min-h-[250px] min-w-[250px] relative flex items-center justify-center flex-col'>
                      <img src='./src/assets/empty-cart.png' alt='' className='w-20 h-20 object-cover' />
                      <div className='text-sm'>Chưa có sản phẩm</div>
                      <Link
                        className='absolute bottom-0 right-0 underline text-primary hover:text-primary/80 transition ease-in duration-300'
                        to={path.home}
                      >
                        Xem sản phẩm
                      </Link>
                    </div>
                  )}
                </div>
              }
            >
              <Link to='/cart' className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6 fill-primary'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                  />
                </svg>
                {purchasesInCart && (
                  <span className='absolute flex items-center justify-center top-[-10px] right-[-6px] rounded-full bg-red-400 text-white px-[4px] py-[1px] text-xs'>
                    {purchasesInCart?.length}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </nav>
  )
}
