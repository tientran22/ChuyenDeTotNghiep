/* eslint-disable prettier/prettier */
import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'

import { useParams } from 'react-router-dom'
import productApi from 'src/apis/products.api'
import InputNumber from 'src/components/InputNumber/InputNumber'
import { Product as ProductType, ProductListConfig } from 'src/types/products.type'
import { formatCurrency, getIdFromNameId, rateSale } from 'src/utils/utils'
import Product from '../ProductsList/components/Product'

export default function ProductDetail() {
  // Xử lí url thân thiện
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  //
  const imageRef = useRef<HTMLImageElement>(null)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetail(id as string)
  })

  const product = productDetailData?.data.product
  console.log(productDetailData?.data)
  const productSimilar = productDetailData?.data.similar_products

  console.log(productSimilar)

  const queryConfig: ProductListConfig = { limit: 6, page: 1, category: product?.category }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    }
  })
  console.log(productsData)
  if (!product) return null

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    // const offsetX = event.pageX - (rect.x + window.scrollX)
    // const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  return (
    <div className='bg-gray-200 py-6'>
      <div className='bg-white p-4 shadow'>
        <div className='container'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={`./src/assets/images/products/${product.image}`}
                  alt={product.name}
                  className='absolute w-full h-full  top-0 left-0 bg-white pointer-events-none'
                  ref={imageRef}
                />
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-2xl font-bold uppercase text-primary'>{product.name}</h1>
              <div className='mt-4'>
                <p className='text-sm line-clamp-6 '>{product.description}</p>
              </div>
              <div className='flex items-center mt-8'>
                <div className='mr-2 border-b border-b-primary text-primary'>{product.rating}</div>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4 fill-primary' key={index}>
                      <defs>
                        <linearGradient id='ratingStarGradient' x1='50%' x2='50%' y1='0%' y2='100%'></linearGradient>
                        <polygon
                          id='ratingStar'
                          points='14.910357 6.35294118 12.4209136 7.66171903 12.896355 4.88968305 10.8823529 2.92651626 13.6656353 2.52208166 14.910357 0 16.1550787 2.52208166 18.9383611 2.92651626 16.924359 4.88968305 17.3998004 7.66171903'
                        />
                      </defs>
                      <g fill='#primary' fillRule='evenodd'>
                        <g transform='translate(-876 -1270)'>
                          <g transform='translate(155 992)'>
                            <g transform='translate(600 29)'>
                              <g transform='translate(10 239)'>
                                <g transform='translate(101 10)'>
                                  <use xlinkHref='#ratingStar' />
                                </g>
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  ))}

                <div className='mx-4 h-4 bg-gray-300 w-[1px]'></div>
                <span className='mr-1 text-primary'>{product.sold}</span>
                <span className='text-gray-500'>Đã bán</span>
              </div>
              <div className='mt-8 flex items-center px-5 py-4 gap-4'>
                <span className='text-gray-500 line-through truncate'>
                  {product.price_before_discount === 0 ? '' : `₫${formatCurrency(product.price_before_discount)}`}
                </span>
                <span className='font-medium text-3xl text-primary'>₫{formatCurrency(product.price)}</span>
                {product.price_before_discount === 0 ? (
                  ''
                ) : (
                  <div className='ml-4 bg-primary px-1 py-2 text-white font-medium uppercase rounded-full text-xs'>
                    {rateSale(product.price_before_discount, product.price)} giảm
                  </div>
                )}
              </div>

              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>số lượng</div>
                <div className='ml-10 flex items-center'>
                  <button className='flex w-8 h-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
                    </svg>
                  </button>
                  <InputNumber
                    value={1}
                    classNameError='hidden'
                    classNameInput='h-8 w-14 border-y border-gray-300 p-1 text-center outline-none'
                  />
                  <button className='flex w-8 h-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='w-4 h-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </button>
                </div>
                <div className='ml-6 text-sm text-gray-600'>{product.quantity} sản phẩm có sẵn</div>
              </div>

              <div className='mt-8 flex items-center'>
                <button className='h-12 flex items-center justify-center rounded-sm border border-primary bg-primary/10 px-5 capitalize text-primary shadow-sm hover:bg-primary/5 gap-2'>
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
                  thêm vào giỏ hàng
                </button>

                <button
                  // onClick={buyNow}
                  className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-primary px-5 capitalize text-white shadow-sm outline-none hover:bg-primary/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
          {productSimilar && (
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 xl:col-span-6'>
              {productSimilar.map((product: ProductType) => (
                <div className='col-span-1' key={product.id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      /
    </div>
  )
}
