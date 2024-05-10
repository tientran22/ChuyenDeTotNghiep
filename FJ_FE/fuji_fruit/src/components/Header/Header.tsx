/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from 'react'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'

import { AppContext } from 'src/contexts/app.context'
import { useQuery } from '@tanstack/react-query'
import { path } from 'src/contains/path'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { useForm } from 'react-hook-form'
import { omit } from 'lodash'
import { purchaseStatus } from 'src/contains/purchase'
import purchaseApi from 'src/apis/purchase.api'

import NavHeader from '../NavHeader'
import axios from 'axios'
import ChatBot from '../ChatBot/ChatBot'

export default function Header() {
  const queryConfig = useQueryConfig()

  const { handleSubmit, register } = useForm({
    defaultValues: {
      name: ''
    }
  })

  const navigate = useNavigate()
  // console.log(queryConfig)

  // console.log(isAuthenticated)

  const onSubmitSearch = handleSubmit((data) => {
    console.log(data)
    navigate({
      pathname: path.products,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order']
        )
      ).toString()
    })
  })

  return (
    <div>
      <header className='border-b-2 border-gray-300 py-1'>
        <div className='container'>
          <NavHeader />
          <div className='flex items-center justify-between gap-10 mt-5 mb-2'>
            <Link to='/' className=''>
              <img src='./src/assets/logo.svg' alt='' className='h-9 lg:12' />
            </Link>

            <form className='col-span-8 w-2/3' onSubmit={onSubmitSearch}>
              <div className='flex rounded-sm p-1'>
                <input
                  type='search'
                  placeholder='Tìm kiếm ...'
                  className='text-black bg-gray-200 mr-4  py-2 px-3 w-full border-none outline-none rounded-full focus:outline-primary'
                  {...register('name')}
                />
                <button className='rounded-full py-2 px-4 flex-shrink-0 bg-primary hover:opacity-90'>
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
              </div>
            </form>

            <div className='flex items-center gap-2'>
              <div className='bg-primary rounded-full text-white p-3 cursor-pointer'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z'
                  />
                </svg>
              </div>
              <div className='hidden md:block text-primary'>
                <p className='mb-2'>Hoa quả sạch Fuji</p>
                <span className='text-xl'>1900 2268</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
