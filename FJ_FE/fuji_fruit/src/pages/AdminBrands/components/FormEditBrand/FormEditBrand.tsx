/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { useState } from 'react'

import AdminBrandApi from 'src/apis/adminBrand.api'

import Popup from 'src/components/Popup/Popup'

import { Brand } from 'src/types/brand.type'

import { SuccessResponse } from 'src/types/utils.type'
interface Props {
  selectedItemId: string
  isEditModalOpen: boolean
  closeEditModal: () => void
  refetchAdminProducts: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<SuccessResponse<Brand[]>>, Error>>
}
export default function FormEditBrand({
  isEditModalOpen,
  closeEditModal,
  selectedItemId,
  refetchAdminProducts
}: Props) {
  const [formData, setFormData] = useState({
    name: ''
  })
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData.

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const EditBrandmutation = useMutation({
    mutationFn: (body: { name: string }) => AdminBrandApi.editbrands(selectedItemId, body)
  })
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Gửi dữ liệu lên server
    e.preventDefault()
    EditBrandmutation.mutate(
      {
        name: formData.name
      },
      {
        onSuccess: (data) => {
          closeEditModal()
          const responseData = data.data.message

          // Mở popup khi thành công
          // Cập nhật state với responseData
          setResponseData(responseData)
          openPopup()
          refetchAdminProducts()
        },
        onError: (data) => {
          console.log(data)
        }
      }
    )
  }
  return (
    <div>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />
      {isEditModalOpen && (
        <div
          id='updateProductModal'
          tabIndex={-1}
          aria-hidden='true'
          className={`${!isEditModalOpen ? 'hidden' : ''} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex  inset-0 bg-gray-800 bg-opacity-80`}
        >
          <div className='relative p-4 w-full max-w-2xl max-h-full'>
            {/* <!-- Modal content --> */}
            <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              {/* <!-- Modal header --> */}
              <div className='flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Sửa thương hiệu</h3>
                <button
                  onClick={closeEditModal}
                  type='button'
                  className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                  data-modal-toggle='updateProductModal'
                >
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='sr-only'>Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <form onSubmit={handleEditSubmit}>
                <div className='grid gap-4 mb-4 sm:grid-cols-2'>
                  <div className='sm:col-span-2'>
                    <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Tên thương hiệu
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Tên tiêu đề'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <button
                    type='submit'
                    className='bg-primary text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                  >
                    Sửa thương hiệu
                  </button>
                  <button
                    type='button'
                    className='text-red-600 inline-flex items-center  hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900'
                  >
                    <svg
                      className='mr-1 -ml-1 w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* <!-- Read modal --> */}
    </div>
  )
}
