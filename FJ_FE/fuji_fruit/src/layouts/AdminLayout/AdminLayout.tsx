import React from 'react'
import AdminHeader from 'src/components/AdminHeader'
import AdminSidebar from 'src/components/AdminSidebar'

interface Props {
  children?: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className='bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row'>
      <AdminSidebar /> {/* Truyền mảng các link từ AdminLayout vào AdminSidebar */}
      <div className='flex flex-col flex-1'>
        <AdminHeader />
        <div className='flex-1 p-4 min-h-0 overflow-auto'>{children}</div>
      </div>
    </div>
  )
}
