import React from 'react'

import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineLogout } from 'react-icons/hi'
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from 'src/contains'
interface Link {
  key: string
  path: string
  icon: React.ReactNode
  label: string
}
const linkClass =
  'flex items-center gap-2 font-light px-3 py-2 hover:bg-cyan-50 hover:no-underline active:bg-cyan-100 rounded-sm text-base'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AdminSidebar() {
  return (
    <div className='bg-white w-60 p-3 flex flex-col'>
      <div className='flex items-center gap-2 pb-4 border-b border-b-slate-200'>
        <img src='/src/assets/logo.svg' alt='' className='w-full h-full object-cover' />
      </div>
      <div className='py-8 flex flex-1 flex-col gap-0.5'>
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
      </div>
      <div className='flex flex-col gap-0.5 pt-2 border-t border-neutral-700'>
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
        <div className={classNames(linkClass, 'cursor-pointer text-red-500')}>
          <span className='text-xl'>
            <HiOutlineLogout />
          </span>
          Đăng xuất
        </div>
      </div>
    </div>
  )
}

function SidebarLink({ link }: { link: Link }) {
  const { pathname } = useLocation()

  return (
    <Link
      to={link.path}
      className={classNames(pathname === link.path ? 'bg-cyan-50 text-cyan-500' : 'text-gray-500', linkClass)}
    >
      <span className='text-xl'>{link.icon}</span>
      {link.label}
    </Link>
  )
}
