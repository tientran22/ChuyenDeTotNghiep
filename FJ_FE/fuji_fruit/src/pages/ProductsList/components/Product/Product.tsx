/* eslint-disable @typescript-eslint/no-unused-vars */

import { Link } from 'react-router-dom'
import { path } from 'src/contains/path'
import { Product as ProductType } from 'src/types/products.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link to={`${path.products}/${generateNameId({ name: product.name, id: product.id })}`}>
      <div className='bg-white relative shadow rounded-md hover:translate-y-2 hover:shadow-md duration-150 transition-transform overflow-hidden'>
        <div className='w-full pt-[100%] relative'>
          <img
            src={`/src/assets/images/products/${product.image}`}
            alt={product.name}
            className='absolute w-full h-full top-0 left-0'
          />
        </div>

        <div className='p-2 overflow-hidden'>
          <div className='min-h-[2.5rem] line-clamp-2  text-primary'>{product.name}</div>
        </div>
        <div className='flex items-center mt-2 px-2'>
          <div className='text-primary mr-2'>
            <span className='text-xs'>₫</span>
            <span className='font-semibold '>{formatCurrency(product.price)}</span>
          </div>

          <span className='line-through text-gray-500 truncate'>
            {product.price_before_discount === 0 ? '' : `₫${formatCurrency(product.price_before_discount)}`}
          </span>
        </div>

        {product.quantity === 0 ? (
          <div className='px-1 py-2 text-xs bg-primary absolute top-0 rounded-sm right-0 text-white'>
            {product.quantity === 0 ? 'Hết hàng' : ''}
          </div>
        ) : (
          ''
        )}
        <div className='mt-2 flex items-center px-2 pb-2 justify-between'>
          <div className='flex items-center'>
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
          </div>

          <span className=' text-primary'>Đã bán {product.sold}</span>
        </div>
      </div>
    </Link>
  )
}
