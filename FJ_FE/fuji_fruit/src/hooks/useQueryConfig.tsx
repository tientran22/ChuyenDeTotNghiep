/* eslint-disable @typescript-eslint/no-unused-vars */
import { isUndefined, omitBy } from 'lodash'
import useQueryParams from './useQueryParams'
import { ProductListConfig } from 'src/types/products.type'

export type queryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
  const queryParams: queryConfig = useQueryParams()

  const queryConfig: queryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 8,
      sort_by: queryParams.sort_by,
      name: queryParams.name,
      order: queryParams.order,
      max_price: queryParams.max_price,
      min_price: queryParams.min_price,
      category: queryParams.category,
      brand: queryParams.brand
    },
    isUndefined
  )
  return queryConfig
}
