/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryObserverResult, RefetchOptions, useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import React, { useEffect, useState } from 'react'
import AdminProductApi from 'src/apis/adminProducts.api'
import brandApi from 'src/apis/brand.api'
import categoryApi from 'src/apis/categories.api'
import Popup from 'src/components/Popup/Popup'
import { Product, ProductList } from 'src/types/products.type'
import { SuccessResponse } from 'src/types/utils.type'
interface Props {
  selectedItemId: string
  isEditModalOpen: boolean
  productData: Product | undefined
  closeEditModal: () => void
  refetchAdminProducts: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<AxiosResponse<SuccessResponse<ProductList>>, Error>>
}
export default function FormEditProduct({
  isEditModalOpen,
  closeEditModal,
  selectedItemId,
  refetchAdminProducts,
  productData
}: Props) {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    price: 0,
    price_before_discount: 0,
    description: '',
    image: ''
  })
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData.
  const [selectedBrandOption, setSelectedBrandOption] = useState(0)
  const [selectedCategoryOption, setSelectedCategoryOption] = useState(0)
  const [selectedImage, setSelectedImage] = useState('')
  const [FileNameImage, setFileNameImage] = useState('')
  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  const { data: brandData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => {
      return brandApi.getBrand()
    }
  })

  useEffect(() => {
    if (productData) {
      setFormData({
        name: productData.name,
        quantity: productData.quantity,
        price: productData.price,
        price_before_discount: productData.price_before_discount,
        description: productData.description,
        image: FileNameImage
      })
    }
  }, [productData])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setFormData({
      ...formData,
      description: newValue
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList && fileList.length > 0) {
      const file = fileList[0]
      const imageUrl = URL.createObjectURL(file) // Tạo URL cho hình ảnh đã chọn
      const fileName = file.name
      setFileNameImage(fileName)
      setSelectedImage(imageUrl) // Lưu URL vào state
    }
  }

  const handleBrandOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBrandOption = parseInt(e.target.value)
    setSelectedBrandOption(selectedBrandOption)
  }

  const handleCategoryOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategoryOption = parseInt(e.target.value)

    setSelectedCategoryOption(selectedCategoryOption)
  }

  const EditProductmutation = useMutation({
    mutationFn: (body: {
      name: string
      quantity: number
      price: number
      price_before_discount: number
      brand_id: number
      category_id: number
      description: string
      image: string
    }) => AdminProductApi.editProducts(selectedItemId, body)
  })
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Gửi dữ liệu lên server
    e.preventDefault()
    EditProductmutation.mutate(
      {
        name: formData.name,
        quantity: formData.quantity,
        price: formData.price,
        price_before_discount: formData.price_before_discount,
        brand_id: selectedBrandOption,
        category_id: selectedCategoryOption,
        description: formData.description,
        image: FileNameImage
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
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Update Product</h3>
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
                  <div>
                    <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Tên sản phẩm
                    </label>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Tên sản phẩm'
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor='quantity' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Số lượng
                    </label>
                    <input
                      type='number'
                      name='quantity'
                      id='quantity'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='0'
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor='price' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Giá
                    </label>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      value={formData.price}
                      onChange={handleInputChange}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='0đ'
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='price_before_discount'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Giá trước khi giảm
                    </label>
                    <input
                      type='number'
                      name='price_before_discount'
                      id='price_before_discount'
                      value={formData.price_before_discount}
                      onChange={handleInputChange}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='0đ'
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor='brand' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Thương hiệu
                    </label>
                    <select
                      name='brand_id'
                      id='default'
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      value={selectedBrandOption}
                      onChange={handleBrandOptionChange}
                    >
                      <option value='' selected>
                        Thương hiệu
                      </option>
                      {Array.isArray(brandData?.data.data) &&
                        brandData?.data.data.map((brandItem) => (
                          <option value={brandItem.id} key={brandItem.id}>
                            {brandItem.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor='category' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
                      Loại
                    </label>
                    <select
                      name='category_id'
                      id='default'
                      value={selectedCategoryOption}
                      onChange={handleCategoryOptionChange}
                      className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                    >
                      <option selected>Loại</option>
                      {Array.isArray(categoriesData?.data.data) &&
                        categoriesData?.data.data.map((categoryItem) => (
                          <option value={categoryItem.id} key={categoryItem.id}>
                            {categoryItem.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className='sm:col-span-2'>
                    <label
                      htmlFor='description'
                      className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                    >
                      Mô tả
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      onChange={handleNoteChange}
                      rows={4}
                      className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      placeholder='Nhập mô tả vào đây'
                    ></textarea>
                  </div>
                </div>
                <div className='mb-4'>
                  <span className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Ảnh sản phẩm</span>
                  <div className='flex justify-center items-center w-full'>
                    <label
                      htmlFor='dropzone-file'
                      className='flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                    >
                      {selectedImage ? (
                        <img src={selectedImage} alt='Selected Image' className='w-full h-full object-cover' />
                      ) : (
                        <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                          <svg
                            aria-hidden='true'
                            className='mb-3 w-10 h-10 text-gray-400'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth='2'
                              d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                            />
                          </svg>
                          <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                            <span className='font-semibold'>Click to upload</span>
                            or drag and drop
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </div>
                      )}
                      <input
                        id='dropzone-file'
                        type='file'
                        value={formData.image}
                        className='hidden'
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                <div className='flex items-center space-x-4'>
                  <button
                    type='submit'
                    className='bg-primary text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                  >
                    Update product
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
