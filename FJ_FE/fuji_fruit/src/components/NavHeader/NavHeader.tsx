/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react'
import Popover from '../Popover'
import { AppContext } from 'src/contexts/app.context'
import { Link, useLocation } from 'react-router-dom'
import { path } from 'src/contains/path'
import Popup from '../Popup/Popup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AuthApi from 'src/apis/auth.api'
import { purchaseStatus } from 'src/contains/purchase'

import http from 'src/utils/https'
import { clearLS, getAccessTokenFromLS, setAccessTokentoLS, setProfileToLS } from 'src/utils/auth'

interface CallbackData {
  access_token: string
}

export default function NavHeader() {
  const [data, setData] = useState<CallbackData | null>(null)
  const location = useLocation()
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const { setisAuthenticated, isAuthenticated, profile, setProfile } = useContext(AppContext)
  const queryClient = useQueryClient()
  console.log(isAuthenticated)
  const logoutMutation = useMutation({
    mutationFn: AuthApi.logout,
    onSuccess: (data) => {
      clearLS()
      const responseData = data.data.message
      // Mở popup khi thành công
      // Cập nhật state với responseData
      setResponseData(responseData)
      openPopup()
      setisAuthenticated(false)

      queryClient.removeQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
    },
    onError: (data) => {
      console.log(data)
    }
  })

  const handleLogout = (openPopup: () => void) => {
    return () => {
      logoutMutation.mutate()
    }
  }

  useEffect(() => {
    ;(async () => {
      try {
        const response = await http.get(`/api/auth/callback${location.search}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
        if (response.status !== 200) {
          throw new Error('Failed to fetch access token')
        }
        setisAuthenticated(true) // Cập nhật trạng thái xác thực của người dùng
        const data = response.data
        const accessToken = data.access_token
        setAccessTokentoLS(accessToken) // Lưu access token vào Local Storage
        setProfileToLS(data.user) // Lưu thông tin người dùng vào Local Storage
        setProfile(data.user) // Cập nhật thông tin người dùng trong ứng dụng
        setData(data)
      } catch (error) {
        console.error('Error:', error)
      }
    })()
  }, [])

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  return (
    <div className='flex items-center justify-between text-gray-700'>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />
      <div className='flex items-center gap-4'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
          <path d='M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 0 0 7.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 0 0 4.902-5.652l-1.3-1.299a1.875 1.875 0 0 0-1.325-.549H5.223Z' />
          <path
            fillRule='evenodd'
            d='M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 0 0 9.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 0 0 2.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3Zm3-6a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75v-3Zm8.25-.75a.75.75 0 0 0-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-5.25a.75.75 0 0 0-.75-.75h-3Z'
            clipRule='evenodd'
          />
        </svg>
        <span className='italic'>08 đường A1, KĐT Vĩnh Điềm Trung, xã Vĩnh Hiệp, Nha Trang, Vietnam</span>
      </div>
      <div className='flex justify-end'>
        <Popover
          className='flex items-center py-1 cursor-pointer'
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
              <div className='flex flex-col py-2 pr-28 pl-3'>
                <button className='py-2 px-3 text-left hover:text-primary'>Tiếng Việt</button>
                <button className='mt-2 py-2 px-3 text-left hover:text-primary'>English</button>
              </div>
            </div>
          }
        >
          <div className='flex items-center hover:text-gray-500'>
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
                d='M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418'
              />
            </svg>
            <span className='mx-1'>Tiếng Việt</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
            </svg>
          </div>
        </Popover>
        {isAuthenticated && (
          <Popover
            className='flex items-center hover:opacity-70 transition-all cursor-pointer ml-10 '
            renderPopover={
              <div className='relative rounded-sm border border-gray-200 bg-white shadow-md '>
                <Link
                  to={path.profile}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-primary'
                >
                  Tài khoản của tôi
                </Link>
                <Link
                  to='/'
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-primary'
                >
                  Đơn mua
                </Link>
                <button
                  onClick={handleLogout(openPopup)}
                  className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-primary'
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className='w-6 h-6 mr-2 flex-shrink-0'>
              <img src='/src/assets/avatar.png' alt='' className='w-full h-full rounded-full object-cover' />
            </div>
            <div className=''>{profile?.name}</div>
          </Popover>
        )}

        {!isAuthenticated && (
          <div className='flex items-center ml-5'>
            <Link to={path.register} className='mx-3 capitalize hover:text-primary'>
              Đăng ký
            </Link>
            <div className='border-r-[1px] border-r-primary h-4 '></div>
            <Link to={path.login} className='mx-3 capitalize hover:text-primary'>
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
