/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */

import React, { ChangeEvent, useState } from 'react'

import FormCreateUser from '../FormCreateOrder'

interface Props {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  searchKeyword: string
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>
  handleRoleChange: (event: ChangeEvent<HTMLSelectElement>) => void
  selectedRole: string
  clearFilters: () => void
}

export default function UserManagement({
  onSubmit,
  searchKeyword,
  setSearchKeyword,
  selectedRole,
  handleRoleChange
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div className='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4'>
      <div className='flex items-center space-x-3 w-full md:w-auto'>
        <select
          value={selectedRole}
          onChange={handleRoleChange}
          defaultValue='default'
          name='roles'
          className='h-9 text-left text-sm capitalize cursor-pointer rounded-sm  outline-none bg-white text-black hover:bg-slate-100 border border-gray-300 px-8'
        >
          <option value='default' className='bg-white text-black'>
            Vai trò
          </option>
          <option value='admin' className='bg-white text-black'>
            Admin
          </option>
          <option value='user' className='bg-white text-black'>
            User
          </option>
        </select>
      </div>
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
          Thêm người dùng
        </button>
      </div>

      <FormCreateUser isModalOpen={isModalOpen} closeModal={closeModal} />
    </div>
  )
}
