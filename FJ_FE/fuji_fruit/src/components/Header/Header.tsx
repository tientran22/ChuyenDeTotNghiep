/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react'
import { Link, NavLink, createSearchParams, useNavigate } from 'react-router-dom'
import Popover from '../Popover'
import { AppContext } from 'src/contexts/app.context'
import { useMutation, useQuery } from '@tanstack/react-query'
import { path } from 'src/contains/path'
import AuthApi from 'src/apis/auth.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { purchaseStatus } from 'src/contains/purchase'
import purchaseApi from 'src/apis/purchase.api'
import classNames from 'classnames'
import { formatCurrency } from 'src/utils/utils'

export default function Header() {
  const queryConfig = useQueryConfig()
  const MAX_PRODUCT = 5
  const { handleSubmit, register } = useForm({
    defaultValues: {
      name: ''
    }
  })

  const navigate = useNavigate()
  // console.log(queryConfig)
  const { setisAuthenticated, isAuthenticated, profile } = useContext(AppContext)
  // console.log(isAuthenticated)

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })

  const purchasesInCart = purchasesInCartData?.data.data
  console.log(purchasesInCart)

  const logoutMutation = useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: () => {
      setisAuthenticated(false)
    },
    onError: (data) => {
      console.log(data)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const onSubmitSearch = handleSubmit((data) => {
    console.log(data)
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order']
        )
      ).toString()
    })
  })

  return (
    <div>
      <header className='border-b-2 border-gray-300 py-1'>
        <div className='container'>
          <div className='flex items-center justify-between text-gray-700'>
            <div className='flex items-center gap-4'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
                <path d='M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z' />
                <path
                  fillRule='evenodd'
                  d='M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3Z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='italic'>08 đường A1, KĐT Vĩnh Điềm Trung, xã Vĩnh Hiệp, Nha Trang, Vietnam</span>
            </div>
            <div className='flex justify-end'>
              <Popover
                className='flex items-center py-1 cursor-pointer'
                renderPopover={
                  <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                    <div className='flex flex-col py-2 pr-28 pl-3'>
                      <button className='py-2 px-3 text-left hover:text-primary'>Tiếng Việt</button>
                      <button className='mt-2 py-2 px-3 text-left hover:text-primary'>English</button>
                    </div>
                  </div>
                }
              >
                <div className='flex items-center hover:text-gray-500'>
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
                      d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
                    />
                  </svg>
                  <span className='mx-1'>Tiếng Việt</span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                  </svg>
                </div>
              </Popover>
              {isAuthenticated && (
                <Popover
                  className='flex items-center hover:opacity-70 transition-all cursor-pointer ml-10'
                  renderPopover={
                    <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                      <Link
                        to={path.profile}
                        className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-primary'
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link
                        to='/'
                        className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-primary'
                      >
                        Đơn mua
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-primary'
                      >
                        Đăng xuất
                      </button>
                    </div>
                  }
                >
                  <div className='w-6 h-6 mr-2 flex-shrink-0'>
                    <img src='./src/assets/avatar.png' alt='' className='w-full h-full rounded-full object-cover' />
                  </div>
                  <div className=''>{profile?.name}</div>
                </Popover>
              )}

              {!isAuthenticated && (
                <div className='flex items-center ml-5'>
                  <Link to={path.regiter} className='mx-3 capitalize hover:text-primary'>
                    Đăng ký
                  </Link>
                  <div className='border-r-[1px] border-r-primary h-4 '></div>
                  <Link to={path.login} className='mx-3 capitalize hover:text-primary'>
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className='flex items-center justify-between gap-10 mt-5 mb-2'>
            <Link to='/' className=''>
              <img src='./src/assets/logo.svg' alt='' className='h-9 lg:12' />
            </Link>

            <form className='col-span-8 w-2/3' onSubmit={onSubmitSearch}>
              <div className='flex rounded-sm p-1'>
                <input
                  type='search'
                  placeholder='Tìm kiếm ...'
                  className='text-black bg-gray-200 mr-4  py-2 px-3 w-full border-none outline-none rounded-full focus:outline-primary'
                  {...register('name')}
                />
                <button className='rounded-full py-2 px-4 flex-shrink-0 bg-primary hover:opacity-90'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 text-white'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                    />
                  </svg>
                </button>
              </div>
            </form>

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

                        <button className='rounded-sm outline-none border-none px-3 py-2 bg-primary text-white hover:opacity-90'>
                          Xem giỏ hàng
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className='p-2 min-h-40 min-w-40 relative flex items-center justify-center flex-col'>
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
                <span className='absolute flex items-center justify-center top-[-10px] right-[-6px] rounded-full bg-red-400 text-white px-[4px] py-[1px] text-xs'>
                  {purchasesInCart?.length}
                </span>
              </Link>
            </Popover>
          </div>
        </div>
      </header>
    </div>
  )
}
