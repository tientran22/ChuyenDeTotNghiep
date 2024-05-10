/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import { IoBagHandle, IoPieChart, IoPeople, IoCart } from 'react-icons/io5'
import AdminApi from 'src/apis/admin.api'
import { formatCurrency } from 'src/utils/utils'
interface BoxWrapperProps {
  children: ReactNode // Định nghĩa children là một ReactNode
}
export default function DashboardStatsGrid() {
  const { data: totalRevenue } = useQuery({
    queryKey: ['adminRevenue'],
    queryFn: () => AdminApi.getRevenue()
  })

  const { data: totalCustomers } = useQuery({
    queryKey: ['adminCustomer'],
    queryFn: () => AdminApi.getTotalCustomers()
  })

  const { data: totalOrders } = useQuery({
    queryKey: ['adminOrder'],
    queryFn: () => AdminApi.getTotalOrders()
  })

  if (!totalRevenue) return null
  if (!totalCustomers) return null
  if (!totalOrders) return null

  return (
    <div className='flex gap-4'>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
          <IoBagHandle className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Tổng doanh thu</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>
              ₫{formatCurrency(totalRevenue.data.total_Revenue)}
            </strong>
            {/* <span className='text-sm text-green-500 pl-2'>+343</span> */}
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-600'>
          <IoPieChart className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Tổng chi phí</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>$3423</strong>
            <span className='text-sm text-green-500 pl-2'>-343</span>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400'>
          <IoPeople className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Tổng khách hàng</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>{totalCustomers.data.total_customers}</strong>
            {/* <span className='text-sm text-red-500 pl-2'>-30</span> */}
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
        <div className='rounded-full h-12 w-12 flex items-center justify-center bg-green-600'>
          <IoCart className='text-2xl text-white' />
        </div>
        <div className='pl-4'>
          <span className='text-sm text-gray-500 font-light'>Tổng đơn hàng</span>
          <div className='flex items-center'>
            <strong className='text-xl text-gray-700 font-semibold'>{totalOrders.data.total_orders}</strong>
            {/* <span className='text-sm text-red-500 pl-2'>-43</span> */}
          </div>
        </div>
      </BoxWrapper>
    </div>
  )
}

function BoxWrapper({ children }: BoxWrapperProps) {
  return <div className='bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center'>{children}</div>
}
