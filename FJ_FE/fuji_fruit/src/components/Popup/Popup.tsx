import React, { useEffect } from 'react'

interface PopupMessageProps {
  message: string
  isOpen: boolean
  onClose: () => void
}

const Popup: React.FC<PopupMessageProps> = ({ message, isOpen, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [isOpen, onClose])

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-20 ${isOpen ? 'visible' : 'hidden'}`}>
      {/* Overlay background */}
      <button className='fixed inset-0 bg-gray-900 opacity-50' onClick={onClose}></button>

      {/* Popup container */}
      <div className={`bg-white rounded-lg p-6 shadow-xl z-50 ${isOpen ? 'block' : 'hidden'}`}>
        {/* Tiêu đề của popup */}
        <div className=''>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-20 h-20 text-primary mx-auto'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
            />
          </svg>
        </div>
        {/* Nội dung của popup */}
        <div className='text-gray-700'>{message}</div>
        {/* Nút đóng popup */}
      </div>
    </div>
  )
}

export default Popup
