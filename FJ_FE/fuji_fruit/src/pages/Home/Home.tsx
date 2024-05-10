/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import productHomeApi from 'src/apis/home.api'
import purchaseApi from 'src/apis/purchase.api'
import AnimationText from 'src/components/AnimationText'
import Banner from 'src/components/Banner'
import Popup from 'src/components/Popup/Popup'
import { path } from 'src/contains/path'
import { purchaseStatus } from 'src/contains/purchase'
import { Product } from 'src/types/products.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import categoryApi from 'src/apis/categories.api'

import { AppContext } from 'src/contexts/app.context'

const CommentsData = [
  {
    id: 1,
    name: 'Linh Nguyen',
    text: 'Trước tình trạng hoa quả nhập khẩu không rõ nguồn gốc tràn lan trên thị trường hiện nay, lựa chọn một nơi an tâm về trái cây có đầy đủ giấy tờ xuất xứ, mình xin phép chọn Hoa quả sạch FUJI nhé!',
    img: '/src/assets/avatar.png'
  },
  {
    id: 2,
    name: 'Tuan Tran',
    text: 'Có lần, tôi muốn đặt giỏ quà tặng sinh nhật đối tác, nhân viên đã gọi điện tư vấn rất nhiệt tình, trang trí rất đẹp và sáng tạo, tôi rất ưng ý vã sẽ thường xuyên mua hàng tại Hệ thồng Hoa quả sạch FUJI.',
    img: '/src/assets/avatar.png'
  },
  {
    id: 3,
    name: 'Lan Dang',
    text: 'Hoa quả sạch FUJI luôn tươi ngon với đầy đủ giấy tờ chứng minh nguồn gốc rõ ràng nên tôi rất yên tâm lựa chọn cho gia đình cũng như tặng người thân, bạn bè!',
    img: '/src/assets/avatar.png'
  },
  {
    id: 4,
    name: 'Khun Dang',
    text: 'Tôi rất hài lòng với chất lượng của hoa quả sạch mà tôi đã mua từ cửa hàng của bạn. Cảm giác khi ăn chúng thực sự khác biệt, vị ngọt tự nhiên và sự tươi mới thật sự làm hài lòng. Tôi sẽ quay lại mua thêm!',
    img: '/src/assets/avatar.png'
  },
  {
    id: 5,
    name: 'Son Nguyen',
    text: 'Tôi thực sự đánh giá cao việc bạn cam kết cung cấp các loại hoa quả không chứa hóa chất và thuốc trừ sâu. Điều này giúp tôi yên tâm hơn khi cho con cái ăn và đảm bảo rằng chúng có một chế độ dinh dưỡng tốt',
    img: '/src/assets/avatar.png'
  }
]

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const [visibleProducts, setVisibleProducts] = useState(5) // Số lượng sản phẩm được hiển thị ban đầu
  const { isAuthenticated } = useContext(AppContext)

  const queryClient = useQueryClient()
  const [buyCount, setBuyCount] = useState(1)
  const navigate = useNavigate()

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

  const { data: productsBestSellerData } = useQuery({
    queryKey: ['productsBestSeller'],
    queryFn: () => {
      return productHomeApi.getProductsBestSeller()
    }
  })
  console.log(productsBestSellerData)

  const addToCartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body)
  })
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  const productsSeller = productsBestSellerData?.data.data
  if (!productsSeller) return null

  const buyNow = async (productId: string) => {
    // Thêm tham số productId
    const res = await addToCartMutation.mutateAsync({ product_id: productId, buy_count: buyCount }) // Sử dụng productId
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase.id
      }
    })
  }

  const category = categoriesData?.data.data
  if (!category) return null
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

  const handleLoadMore = () => {
    // Tăng số lượng sản phẩm được hiển thị lên mỗi lần nhấn nút "Xem thêm"
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 5)
  }

  const productsGift = '1'

  const handleSeeAll = () => {
    navigate({
      pathname: path.products,
      search: createSearchParams({
        category: productsGift
      }).toString()
    })
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

      <div className='container relative'>
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
              productsImportData?.data.data.slice(0, visibleProducts).map((product: Product) => (
                <div key={product.id}>
                  <div className='bg-white relative text-center  rounded-md hover:translate-y-2 hover:shadow-md duration-150 transition-transform overflow-hidden'>
                    <Link to={`${path.products}/${generateNameId({ name: product.name, id: product.id })}`}>
                      <div className='w-full pt-[100%] relative'>
                        <img
                          src={`/src/assets/images/products/${product.image}`}
                          alt={product.name}
                          className='absolute w-full h-full top-0 left-0'
                        />
                      </div>
                    </Link>
                    <Link
                      to={`${path.products}/${generateNameId({ name: product.name, id: product.id })}`}
                      className='p-2 overflow-hidden'
                    >
                      <div className='min-h-[2.5rem] line-clamp-2 font-semibold  text-primary'>{product.name}</div>
                    </Link>
                    {product.quantity === 0 ? (
                      <div className='px-1 py-2 text-xs bg-primary absolute top-0 rounded-sm right-0 text-white'>
                        {product.quantity === 0 ? 'Hết hàng' : ''}
                      </div>
                    ) : (
                      ''
                    )}
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
                        !isAuthenticated ? navigate(path.login) : addToCart(openPopup, e)(product.id) // Gọi hàm addToCart khi nút được nhấn
                      }}
                      className={`h-8 flex items-center justify-center rounded-sm border border-primary bg-primary/10 px-2 text-sm mx-auto capitalize text-primary shadow-sm hover:bg-primary/5 gap-2 ${product.quantity === 0 ? 'cursor-not-allowed hover:bg-primary/10' : ''}`}
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
                </div>
              ))}
          </div>
          <div className='flex items-center justify-center mt-4'>
            <button
              onClick={handleLoadMore}
              className='px-4 py-2 bg-none border border-primary text-primary hover:text-white hover:bg-primary/80 rounded-sm '
            >
              Xem thêm
            </button>
          </div>
        </div>

        <div className='py-6'>
          <div className='flex items-center justify-between text-xl font-semibold'>
            <div className='flex'>
              Sản phẩm <AnimationText text=' Best Seller ' className='text-primary'></AnimationText>của Fuji Fruit
            </div>
          </div>
        </div>

        <div className='py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {Array.isArray(productsBestSellerData?.data.data) &&
            productsBestSellerData.data.data.map((product: Product) => (
              <div className='flex bg-slate-100 rounded-md overflow-hidden relative ' key={product.id}>
                <Link to={`${path.products}/${generateNameId({ name: product.name, id: product.id })}`} className=''>
                  <img
                    src={`/src/assets/images/products/${product.image}`}
                    alt={product.name}
                    className='w-[192px] h-[192px] object-cover flex-shrink-0'
                  />
                </Link>
                {product.quantity === 0 ? (
                  <div className='px-1 py-2 text-xs bg-primary absolute top-0 rounded-sm left-0 text-white'>
                    {product.quantity === 0 ? 'Hết hàng' : ''}
                  </div>
                ) : (
                  ''
                )}
                <div className='p-6'>
                  <Link
                    to={`${path.products}/${generateNameId({ name: product.name, id: product.id })}`}
                    className='block text-primary text-xl min-h-[3rem] cursor-pointer'
                  >
                    {product.name}
                  </Link>
                  <button
                    onClick={() => (!isAuthenticated ? navigate(path.login) : buyNow(product.id))} // Thêm tham số product.id khi gọi hàm buyNow
                    className={` mt-2 mx-auto px-4 py-2 bg-amber-300 text-white border-none outline-none rounded-full hover:bg-primary/80 ${product.quantity === 0 ? 'cursor-not-allowed hover:bg-amber-300' : ''}`}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className='py-6'>
          <div className='flex items-center justify-between text-lg md:text-xl font-semibold'>
            <div className='flex'>
              Sản phẩm <AnimationText text=' Giỏ quà ' className='text-primary'></AnimationText>của Fuji Fruit
            </div>

            <button
              onClick={handleSeeAll}
              className='flex items-center gap-2 px-4 py-2 bg-primary border-none outline-none text-white hover:bg-primary/90 rounded-sm text-sm'
            >
              <span className='hidden md:block'>Xem ngay</span>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-4 h-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />
              </svg>
            </button>
          </div>

          <div className='py-6 '>
            <Slider {...settings}>
              {Array.isArray(productsGiftData?.data.data) &&
                productsGiftData.data.data.map((product: Product) => (
                  <Link
                    to={`${path.products}/${generateNameId({ name: product.name, id: product.id })}`}
                    key={product.id}
                  >
                    <div className='bg-white relative text-center  rounded-md hover:translate-y-2 hover:shadow-md duration-150 transition-transform overflow-hidden  mx-3 mb-4'>
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
                      {product.quantity === 0 ? (
                        <div className='px-1 py-2 text-xs bg-primary absolute top-0 rounded-sm right-0 text-white'>
                          {product.quantity === 0 ? 'Hết hàng' : ''}
                        </div>
                      ) : (
                        ''
                      )}
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

        <div className='mt-12 bg-neutral-100 p-4'>
          <div className='grid grid-cols-12'>
            <div className='col-span-6'>
              <img src='/src/assets/images/about.png' alt='' />
            </div>
            <div className='col-span-6'>
              <div className='text-primary uppercase'>Khát vọng vươn lên</div>
              <div className='mt-4 text-xl md:text-6xl font-semibold'>
                Niềm tự hào về <AnimationText text=' Chất lượng ' className='text-primary'></AnimationText> của fuji
                Fruit
              </div>
              <p className='mt-4 leading-6 text-sm md:text-lg '>
                Chúng tôi luôn mong muốn và đã tạo ra nhiều giá trị về sức khỏe và niềm vui cho người dùng Việt. Điều đó
                thật hạnh phúc khi thật vinh dự vì khách hàng đã tin tưởng vào dịch vụ và sản phẩm của Fuji Fruit. Khách
                hàng và động lực lớn nhất để chúng tôi phát triển và lớn hơn từng ngày.
              </p>
            </div>
          </div>
        </div>

        <div className='mt-12'>
          <div className='grid md:grid-cols-12 gap-20'>
            <div className='col-span-7'>
              <div className=' text-xl md:text-4xl font-semibold flex'>
                Tại sao bạn <AnimationText text=' Lựa chọn ' className='text-primary'></AnimationText> chúng tôi
              </div>
              <p className='mt-2 leading-6 text-sm md:text-lg'>
                Hoa quả sạch Fuji với đa dạng các trái cây nhập khẩu đến từ các nền nông nghiệp tiên tiến, hiện đại bậc
                nhất thế giới: Nhật Bản, Hoa Kỳ, Hàn Quốc, Canada, Autralia,… đem đến dinh dưỡng và những sự lựa phong
                phú người dùng
              </p>
              <div className='mt-4 font-semibold'>
                <div className='flex items-center gap-2 mt-6'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5 text-primary'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                  Tận tâm với khách hàng và người tiêu dùng
                </div>
                <div className='flex items-center gap-2 mt-6'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5 text-primary'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                  Hệ thống 48 cửa hàng Fuji trên toàn quốc
                </div>
                <div className='flex items-center gap-2 mt-6'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5 text-primary'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                  Quy trình sản phẩm khắt khe chuẩn mực hàng đầu
                </div>
                <div className='flex items-center gap-2 mt-6'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5 text-primary'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                  Công nghệ bảo quản lạnh CAS hiện đại tân tiến
                </div>
              </div>
            </div>
            <div className='col-span-5'>
              <div>
                <img src='/src/assets/images/why.png' alt='' className='w-[360px] h-[360px] rounded-3xl' />
              </div>
            </div>
          </div>
          <div className='mt-4 text-xl md:text-4xl text-center text-primary font-semibold'>FeedBack từ khách hàng</div>
          <Slider {...settings}>
            {CommentsData.map((data) => (
              <div className='my-6' key={data.id}>
                <div className='flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-primary/10 relative'>
                  <div className='mb-4'>
                    <img src={data.img} alt='' className='rounded-full w-20 h-20' />
                  </div>
                  <div className='flex flex-col items-center gap-4'>
                    <div className='space-y-3'>
                      <p className='text-sm min-h-[8rem] text-gray-500'>{data.text}</p>
                      <h1 className='text-xl font-bold text-black/80 dark:text-light'>{data.name}</h1>
                    </div>
                  </div>
                  <p className='text-black/20 text-9xl font-serif absolute top-0 right-0'>,,</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className='mt-12'>
          <img src='/src/assets/images/hero.png' alt='' className='w-full h-full object-cover rounded-2xl' />
        </div>
      </div>
    </div>
  )
}
