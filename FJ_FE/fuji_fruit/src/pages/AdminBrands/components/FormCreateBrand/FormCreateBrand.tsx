/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { ChangeEvent, useState } from 'react'
import AdminBlogApi from 'src/apis/adminBlog.api'
import AdminBrandApi from 'src/apis/adminBrand.api'
import AdminProductApi from 'src/apis/adminProducts.api'
import brandApi from 'src/apis/brand.api'
import categoryApi from 'src/apis/categories.api'
import Button from 'src/components/Button'
import Popup from 'src/components/Popup/Popup'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ProductListConfig } from 'src/types/products.type'
interface Props {
  isModalOpen: boolean
  closeModal: () => void
}
export default function FormCreateBrand({ isModalOpen, closeModal }: Props) {
  const [formData, setFormData] = useState({
    name: ''
  })

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const queryConfig = useQueryConfig()

  const { data: adminBrandData, refetch } = useQuery({
    queryKey: ['adminBrand', queryConfig],
    queryFn: () => AdminBrandApi.getBrands(queryConfig as ProductListConfig)
  })
  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const Brandmutation = useMutation({
    mutationFn: (body: { name: string }) => AdminBrandApi.createbrands(body)
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Gửi dữ liệu lên server
    e.preventDefault()
    Brandmutation.mutate(
      {
        name: formData.name
      },
      {
        onSuccess: (data) => {
          closeModal()
          const responseData = data.data.message
          console.log(data.data.message)
          // Mở popup khi thành công
          // Cập nhật state với responseData
          setResponseData(responseData)
          openPopup()
          refetch()
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
      {isModalOpen && (
        <div
          id='createBlogModal'
          tabIndex={-1}
          aria-hidden='true'
          className={`${!isModalOpen ? 'hidden' : ''} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex  inset-0 bg-gray-800 bg-opacity-80`}
        >
          <div className='relative p-4 w-full max-w-2xl max-h-full'>
            {/* <!-- Modal content --> */}
            <div className='relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              {/* <!-- Modal header --> */}
              <div className='flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Thêm thương hiệu</h3>
                <button
                  type='button'
                  onClick={closeModal}
                  className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                  data-modal-target='createBlogModal'
                  data-modal-toggle='createBlogModal'
                >
                  <svg
                    aria-hidden='true'
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fill-rule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clip-rule='evenodd'
                    />
                  </svg>
                  <span className='sr-only'>Close modal</span>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <form action='#' onSubmit={onSubmit}>
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
                      placeholder='Tên thương hiệu'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className='flex justify-end'>
                  <Button
                    disabled={Brandmutation.isPending}
                    isLoading={Brandmutation.isPending}
                    type='submit'
                    className='text-white inline-flex items-center  bg-primary hover:bg-primary/80 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                  >
                    Thêm thương hiệu
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
