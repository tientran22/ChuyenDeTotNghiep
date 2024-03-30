/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from 'react'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Popover from '../Popover'
import { AppContext } from 'src/contexts/app.context'
import { useQuery } from '@tanstack/react-query'
import { path } from 'src/contains/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { purchaseStatus } from 'src/contains/purchase'
import purchaseApi from 'src/apis/purchase.api'
import { formatCurrency } from 'src/utils/utils'
import NavHeader from '../NavHeader'

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
  const { isAuthenticated } = useContext(AppContext)
  // console.log(isAuthenticated)

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart }),
    enabled: isAuthenticated
  })

  const purchasesInCart = purchasesInCartData?.data.data
  console.log(purchasesInCart)

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
          <NavHeader />
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
      </header>
    </div>
  )
}
