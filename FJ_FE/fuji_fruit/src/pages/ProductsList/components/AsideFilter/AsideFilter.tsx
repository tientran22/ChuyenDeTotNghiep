import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'

import { path } from 'src/contains/path'
import { Category } from 'src/types/categories.type'

import classNames from 'classnames'
import InputNumber from 'src/components/InputNumber/InputNumber'
import { Controller, useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema } from 'yup'
import { NoUndefinedField } from 'src/types/utils.type'
import { useState } from 'react'
import { Brand } from 'src/types/brand.type'
import { omit } from 'lodash'
import { queryConfig } from '../../ProductList'

interface Props {
  queryConfig: queryConfig
  categories: Category[]
  brands: Brand[]
}
type FormData = NoUndefinedField<Pick<Schema, 'max_price' | 'min_price'>>

/**
 * Rule validate
 * Nếu có price_min và price_max thì price_max >= price_min
 * Còn không thì có price_min thì không có price_max và ngược lại
 */

const priceSchema = schema.pick(['min_price', 'max_price'])

export default function AsideFilter({ queryConfig, categories, brands }: Props) {
  const { category, brand } = queryConfig
  const [minPrice, setMinPrice] = useState<string>('') // State for min_price
  const [maxPrice, setMaxPrice] = useState<string>('') // State for max_price
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      min_price: '',
      max_price: ''
    },
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>)
  })

  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    console.log(data)
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        min_price: data.min_price,
        max_price: data.max_price
      }).toString()
    })
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Ngăn chặn hành vi mặc định của nút "submit"
    onSubmit() // Gọi hàm onSubmit để xử lý dữ liệu
  }

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['max_price', 'min_price', 'brand', 'category'])).toString()
    })
  }

  return (
    <div className='py-4 font-semibold'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-primary': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
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
        Danh mục
        {/* {t('aside filter.all categories')} */}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category == categoryItem.id
          return (
            <li className='py-2 pl-2' key={categoryItem.id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem.id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-primary': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-2 w-2 fill-primary'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <Link
        to={path.home}
        className={classNames('flex items-center font-bold mt-6', {
          'text-primary': !brand
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
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
        Nguồn gốc
        {/* {t('aside filter.all categories')} */}
      </Link>

      <div className='my-4 h-[1px] bg-gray-300' />

      {brands.map((brandItem) => {
        const isActive = brand == brandItem.id
        return (
          <div className='flex items-center' key={brandItem.id}>
            <input
              type='radio'
              id='radio1'
              onClick={() =>
                navigate({
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    brand: brandItem.id
                  }).toString()
                })
              }
              name='radio'
              className='w-6 h-6 mr-2 my-4 cursor-pointer'
              checked={isActive}
              readOnly
            />
            <label htmlFor='radio1'>{brandItem.name}</label>
          </div>
        )
      })}

      <Link to={path.home} className='mt-4 flex items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        Bộ lộc tìm kiếm
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form className='mt-2' onSubmit={handleFormSubmit}>
          <div className='flex items-start my-4'>
            <Controller
              control={control}
              name='min_price'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ TỪ'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      setMinPrice(event.target.value) // Update minPrice state
                      field.onChange(event)
                      trigger('min_price')
                    }}
                    value={minPrice} // Set input value to minPrice state
                  />
                )
              }}
            />
            <div className='mx-2 shrink-0'>_</div>
            <Controller
              control={control}
              name='max_price'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ '
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      setMaxPrice(event.target.value) // Update maxPrice state
                      field.onChange(event)
                      trigger('max_price')
                    }}
                    value={maxPrice} // Set input value to minPrice state
                  />
                )
              }}
            />
          </div>
          <div className='my-2 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.min_price?.message}</div>
          <Button className='px-3 py-2 w-full rounded-sm bg-primary text-white hover:bg-primary/80'>Áp dụng</Button>
        </form>
      </div>
      <Button
        onClick={handleRemoveAll}
        className='px-3 py-2 w-full rounded-sm bg-primary text-white hover:bg-primary/80'
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
