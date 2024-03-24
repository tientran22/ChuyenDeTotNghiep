/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query'
import AsideFilter from './components/AsideFilter'

import productApi from 'src/apis/products.api'
import useQueryParams from 'src/hooks/useQueryParams'

import Pagination from 'src/components/Pagination'
import { ProductListConfig } from 'src/types/products.type'

import categoryApi from 'src/apis/categories.api'
import { Category } from 'src/types/categories.type'
import brandApi from 'src/apis/brand.api'
import { Brand } from 'src/types/brand.type'
import Product from './components/Product'
import SortProductList from './components/SortProductList'
import useQueryConfig from 'src/hooks/useQueryConfig'
import Popup from 'src/components/Popup/Popup'
import { useState } from 'react'
export type queryConfig = {
  [key in keyof ProductListConfig]: string
}

function ProductList() {
  // Lay url search params
  const queryConfig = useQueryConfig()

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    }
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  const { data: brandData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => {
      return brandApi.getBrand()
    }
  })

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  return (
    <div className='bg-white p-6'>
      <button onClick={openPopup}>Hiển thị Popup</button>
      <Popup message='Đây là nội dung của popup message.' isOpen={isPopupOpen} onClose={closePopup} />
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter
                queryConfig={queryConfig}
                categories={(categoriesData?.data.data || []) as Category[]}
                brands={(brandData?.data.data || []) as Brand[]}
              />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xl:col-span-5'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product.id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
