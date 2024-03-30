/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import productHomeApi from 'src/apis/home.api'
import purchaseApi from 'src/apis/purchase.api'
import AnimationText from 'src/components/AnimationText'
import Banner from 'src/components/Banner'
import Popup from 'src/components/Popup/Popup'
import { path } from 'src/contains/path'
import { purchaseStatus } from 'src/contains/purchase'
import { Product } from 'src/types/products.type'
// import { path } from 'src/contains/path'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const queryClient = useQueryClient()
  const [buyCount, setBuyCount] = useState(1)

  const { data: productsImportData } = useQuery({
    queryKey: ['productsImport'],
    queryFn: () => {
      return productHomeApi.getProductsImport()
    }
  })

  const { data: productsGiftData } = useQuery({
    queryKey: ['productsGift'],
    queryFn: () => {
      return productHomeApi.getProductsGift()
    }
  })
  console.log(productsGiftData)

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body)
  })

  const product = productsImportData?.data.data
  if (!product) return null

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const addToCart =
    (openPopup: () => void, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => (productId: string) => {
      event.preventDefault() // Ngăn chặn hành vi mặc định của sự kiện click
      addToCartMutation.mutate(
        { buy_count: buyCount, product_id: productId },
        {
          onSuccess: (data) => {
            const responseData = data.data.message
            console.log(data.data.message)
            // Mở popup khi thành công
            // Cập nhật state với responseData
            setResponseData(responseData)
            openPopup()
            // Làm mới truy vấn
            queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
          }
        }
      )
    }

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  return (
    <div className='bg-white p-6'>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />

      <div className='container'>
        <Banner autoSlide={true} autoSlideInterval={3000}></Banner>
        <div className='py-6'>
          <div className='flex items-center justify-center w-full relative gap-2'>
            <span className=' w-full  h-0.5 bg-primary transform -translate-y-1/2'></span>
            <AnimationText
              className='flex-shrink-0 text-primary text-xl uppercase font-semibold '
              text='Trái cây nhập khẩu'
            ></AnimationText>
            <span className=' w-full h-0.5 bg-primary transform -translate-y-1/2'></span>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-6 gap-4'>
            {Array.isArray(productsImportData?.data.data) &&
              productsImportData?.data.data.map((product: Product) => (
                <Link to={`${path.home}${generateNameId({ name: product.name, id: product.id })}`} key={product.id}>
                  <div className='bg-white relative text-center  rounded-md hover:translate-y-2 hover:shadow-md duration-150 transition-transform overflow-hidden'>
                    <div className='w-full pt-[100%] relative'>
                      <img
                        src={`/src/assets/images/products/${product.image}`}
                        alt={product.name}
                        className='absolute w-full h-full top-0 left-0'
                      />
                    </div>
                    <div className='p-2 overflow-hidden'>
                      <div className='min-h-[2.5rem] line-clamp-2 font-semibold  text-primary'>{product.name}</div>
                    </div>
                    <div className='flex items-center mt-2 px-2 justify-center'>
                      <div className='text-primary mr-2'>
                        <span className='text-xs'>₫</span>
                        <span className='font-semibold '>{formatCurrency(product.price)}</span>
                      </div>

                      <span className='line-through text-gray-500 truncate'>
                        {product.price_before_discount === 0 ? '' : `₫${formatCurrency(product.price_before_discount)}`}
                      </span>
                    </div>
                    <div className='flex items-center my-2 justify-center'>
                      {Array(5)
                        .fill(0)
                        .map((_, index) => (
                          <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4 fill-primary' key={index}>
                            <defs>
                              <linearGradient
                                id='ratingStarGradient'
                                x1='50%'
                                x2='50%'
                                y1='0%'
                                y2='100%'
                              ></linearGradient>
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
                    </div>
                  </div>
                  <div className='mt-4 flex items-center'>
                    <button
                      onClick={(e) => {
                        addToCart(openPopup, e)(product.id) // Gọi hàm addToCart khi nút được nhấn
                      }}
                      className='h-8 flex items-center justify-center rounded-sm border border-primary bg-primary/10 px-2 text-sm mx-auto capitalize text-primary shadow-sm hover:bg-primary/5 gap-2'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='w-4 h-4 fill-primary'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                        />
                      </svg>
                      thêm vào giỏ hàng
                    </button>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        <div className='flex items-center justify-center'>
          <button className='px-4 py-2 bg-none border border-primary text-primary hover:text-white hover:bg-primary/80 rounded-sm '>
            Xem thêm
          </button>
        </div>
        <div className='py-6'>
          <div className='flex items-center justify-between text-xl font-semibold'>
            <div className='flex'>
              Sản phẩm <AnimationText text=' Giỏ quà ' className='text-primary'></AnimationText>của Fuji Fruit
            </div>

            <button className='flex items-center gap-2 px-4 py-2 bg-primary border-none outline-none text-white hover:bg-primary/90 rounded-sm '>
              Xem ngay
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />
              </svg>
            </button>
          </div>

          <div className='py-6'>
            <Slider {...settings}>
              {Array.isArray(productsGiftData?.data.data) &&
                productsGiftData.data.data.map((product: Product) => (
                  <Link to={`${path.home}${generateNameId({ name: product.name, id: product.id })}`} key={product.id}>
                    <div className='bg-white relative text-center  rounded-md hover:translate-y-2 hover:shadow-md duration-150 transition-transform overflow-hidden  mx-3'>
                      <div className='w-full pt-[100%] relative'>
                        <img
                          src={`/src/assets/images/products/${product.image}`}
                          alt={product.name}
                          className='absolute w-full h-full top-0 left-0'
                        />
                      </div>
                      <div className='p-2 overflow-hidden'>
                        <div className='line-clamp-2 font-semibold  text-primary'>{product.name}</div>
                      </div>

                      <div className='flex items-center mt-2 justify-center'>
                        {Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <svg viewBox='0 0 9.5 8' className='mr-1 h-4 w-4 fill-primary' key={index}>
                              <defs>
                                <linearGradient
                                  id='ratingStarGradient'
                                  x1='50%'
                                  x2='50%'
                                  y1='0%'
                                  y2='100%'
                                ></linearGradient>
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
                      </div>
                    </div>
                  </Link>
                ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  )
}
