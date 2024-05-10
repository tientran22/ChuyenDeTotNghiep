import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import AdminApi from 'src/apis/admin.api'
import { Product } from 'src/types/products.type'
import { formatCurrency } from 'src/utils/utils'

function PopularProducts() {
  const { data: productPopulars } = useQuery({
    queryKey: ['productPopurlar'],
    queryFn: () => AdminApi.getProductPopulars()
  })
  if (!productPopulars) return null
  return (
    <div className='w-[20rem] bg-white p-4 rounded-sm border border-gray-200'>
      <strong className='text-gray-700 font-medium'>Sản phẩm phổ biến</strong>
      <div className='mt-4 flex flex-col gap-3'>
        {productPopulars.data.popular_products.map((product: Product) => (
          <Link key={product.id} to={`/product/${product.id}`} className='flex items-start hover:no-underline'>
            <div className='w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm'>
              <img
                className='w-full h-full object-cover rounded-sm'
                src={`/src/assets/images/products/${product.image}`}
                alt={product.name}
              />
            </div>
            <div className='ml-4 flex-1'>
              <p className='text-sm text-gray-800'>{product.name}</p>
              <span
                className={classNames(
                  product.quantity === 0
                    ? 'text-red-500'
                    : product.quantity > 50
                      ? 'text-green-500'
                      : 'text-orange-500',
                  'text-xs font-medium'
                )}
              >
                {product.quantity === 0 ? 'hết số lượng' : product.quantity + ' sản phẩm'}
              </span>
            </div>
            <div className='text-xs text-primary pl-1.5'>₫{formatCurrency(product.price)}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default PopularProducts
