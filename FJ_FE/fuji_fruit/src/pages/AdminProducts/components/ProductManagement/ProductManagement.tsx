/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber/InputNumber'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { NoUndefinedField } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rules'
import { ObjectSchema } from 'yup'
import FormCreateProduct from '../FormCreateProduct'

import { Brand } from 'src/types/brand.type'
import { Category } from 'src/types/categories.type'

import { createSearchParams, useNavigate } from 'react-router-dom'

type FormData = NoUndefinedField<Pick<Schema, 'max_price' | 'min_price'>>
interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  searchKeyword: string
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>
  brand: Brand
  category: Category
  selectedCategories: string[]
  handleCategoryChange: (categoryId: string) => void
  selectedBrands: string[]
  handlebrandChange: (brandId: string) => void
  clearFilters: () => void
  openFilter: () => void
  isFilterOpen: boolean
}
const priceSchema = schema.pick(['min_price', 'max_price'])
export default function ProductManagement({
  openFilter,
  isFilterOpen,
  onSubmit,
  searchKeyword,
  setSearchKeyword,
  brand,
  category,
  selectedCategories,
  handleCategoryChange,
  selectedBrands,
  handlebrandChange,
  clearFilters
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isDropdownBrandOpen, setIsDropdownBrandOpen] = useState(false)

  const [isPriceOpen, setIsPriceOpen] = useState(true)

  const queryConfig = useQueryConfig()
  const navigate = useNavigate()
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
  const [minPrice, setMinPrice] = useState<string>('') // State for min_price
  const [maxPrice, setMaxPrice] = useState<string>('') // State for max_price

  console.log(selectedCategories)
  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleDropdownBrand = () => {
    setIsDropdownBrandOpen(!isDropdownBrandOpen)
  }

  const togglePrice = () => {
    setIsPriceOpen(!isPriceOpen)
  }

  const onSubmitPrice = handleSubmit((data) => {
    console.log(data)
    navigate({
      search: createSearchParams({
        // ...queryConfig,
        min_price: data.min_price,
        max_price: data.max_price
      }).toString()
    })
  })

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Ngăn chặn hành vi mặc định của nút "submit"
    onSubmitPrice() // Gọi hàm onSubmit để xử lý dữ liệu
  }

  return (
    <div className='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4'>
      <div className='w-full md:w-1/2'>
        <form className='flex items-center' onSubmit={onSubmit}>
          <label htmlFor='simple-search' className='sr-only'>
            Search
          </label>
          <div className='relative w-full'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <svg
                aria-hidden='true'
                className='w-5 h-5 text-gray-500 dark:text-gray-400'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                  clip-rule='evenodd'
                />
              </svg>
            </div>
            <input
              type='text'
              id='simple-search'
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder='Tìm kiếm sản phẩm...'
              name='search'
            />
          </div>

          <button className='ml-2 rounded-full py-2 px-4 flex-shrink-0 bg-primary hover:opacity-90'>
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
        </form>
      </div>
      <div className='w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0'>
        <button
          onClick={openModal}
          type='button'
          id='createProductModalButton'
          data-modal-target='createProductModal'
          data-modal-toggle='createProductModal'
          className=' bg-primary flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'
        >
          <svg
            className='h-3.5 w-3.5 mr-2'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              clip-rule='evenodd'
              fill-rule='evenodd'
              d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
            />
          </svg>
          Thêm sản phẩm
        </button>
        <div className='flex items-center space-x-3 w-full md:w-auto'>
          <button
            onClick={openFilter}
            id='filterDropdownButton'
            data-dropdown-toggle='filterDropdown'
            className='w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 relative'
            type='button'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
              className='h-4 w-4 mr-1.5 -ml-1 text-gray-400'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fill-rule='evenodd'
                d='M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z'
                clip-rule='evenodd'
              />
            </svg>
            Bộ lọc tùy chọn
            <svg
              className='-mr-1 ml-1.5 w-5 h-5'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <path
                clip-rule='evenodd'
                fill-rule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              />
            </svg>
          </button>
          {isFilterOpen && (
            <div
              id='filterDropdown'
              className={`z-10 ${!isFilterOpen ? 'hidden' : ''} px-3 pt-1 bg-white rounded-lg shadow-lg  w-80 dark:bg-gray-700 right-0 absolute top-16`}
            >
              <div className='flex items-center justify-between pt-2'>
                <h6 className='text-sm font-medium text-black dark:text-white'>Filters</h6>
                <Button onClick={clearFilters} className='flex items-center space-x-3 underline text-primary'>
                  Xóa tất cả
                </Button>
              </div>
              <div className='pt-3 pb-2'>
                {/* <!-- Category --> */}
                <h2 id='category-heading'>
                  <button
                    type='button'
                    onClick={toggleDropdown}
                    className='flex items-center justify-between w-full py-2 px-1.5 text-sm font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    aria-expanded={isDropdownOpen ? 'true' : 'false'}
                    aria-controls='category-body'
                  >
                    <span>Category</span>
                    <svg
                      aria-hidden='true'
                      data-accordion-icon=''
                      className={`w-5 h-5 rotate-${isDropdownOpen ? '0' : '180'} shrink-0`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div id='category-body' className='py-2 font-light border-b border-gray-200 dark:border-gray-600'>
                      {Array.isArray(category) &&
                        category.map((categoryItem: Category) => (
                          <ul className='space-y-2 mt-2' key={categoryItem.id}>
                            <li className='flex items-center'>
                              <input
                                id='apple'
                                type='checkbox'
                                checked={selectedCategories.includes(categoryItem.id)}
                                onChange={() => handleCategoryChange(categoryItem.id)}
                                className='w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                              />
                              <label
                                htmlFor='apple'
                                className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-100'
                              >
                                {categoryItem.name}
                              </label>
                            </li>
                          </ul>
                        ))}
                    </div>
                  )}
                </h2>
                <h2 id='brand-heading'>
                  <button
                    type='button'
                    onClick={toggleDropdownBrand}
                    className='flex items-center justify-between w-full py-2 px-1.5 text-sm font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    aria-expanded={isDropdownBrandOpen ? 'true' : 'false'}
                    aria-controls='brand-body'
                  >
                    <span>Brand</span>
                    <svg
                      aria-hidden='true'
                      data-accordion-icon=''
                      className={`w-5 h-5 rotate-${isDropdownBrandOpen ? '0' : '180'} shrink-0`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      />
                    </svg>
                  </button>

                  {isDropdownBrandOpen && (
                    <div id='brand-body' className='py-2 font-light border-b border-gray-200 dark:border-gray-600'>
                      {Array.isArray(brand) &&
                        brand.map((brandItem: Brand) => (
                          <ul className='space-y-2 mt-2' key={brandItem.id}>
                            <li className='flex items-center'>
                              <input
                                id='apple'
                                type='checkbox'
                                checked={selectedBrands.includes(brandItem.id)}
                                onChange={() => handlebrandChange(brandItem.id)}
                                className='w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500'
                              />
                              <label
                                htmlFor='apple'
                                className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-100'
                              >
                                {brandItem.name}
                              </label>
                            </li>
                          </ul>
                        ))}
                    </div>
                  )}
                </h2>
                {/* <!-- Price --> */}
                <form className='mt-2' onSubmit={handleFormSubmit}>
                  {' '}
                  <h2 id='price-heading'>
                    <button
                      type='button'
                      onClick={togglePrice}
                      className='flex items-center justify-between w-full py-2 px-1.5 text-sm font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      data-accordion-target='#price-body'
                      aria-expanded={isPriceOpen ? 'true' : 'false'}
                      aria-controls='price-body'
                    >
                      <span>Price</span>
                      <svg
                        aria-hidden='true'
                        data-accordion-icon=''
                        className={`w-5 h-5 rotate-${isPriceOpen ? '0' : '180'} shrink-0`}
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        />
                      </svg>
                    </button>
                  </h2>
                  {isPriceOpen && (
                    <div id='price-body' className={`${!isPriceOpen ? 'hidden' : ''}`} aria-labelledby='price-heading'>
                      <div className='flex items-center py-2 space-x-3 font-light border-b border-gray-200 dark:border-gray-600'>
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
                    </div>
                  )}
                  <div className='my-2 min-h-[1.25rem] text-center text-sm text-red-600'>
                    {errors.min_price?.message}
                  </div>
                  <Button className='px-3 py-2 w-full rounded-sm bg-primary text-white hover:bg-primary/80'>
                    Áp dụng
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <FormCreateProduct isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  )
}
