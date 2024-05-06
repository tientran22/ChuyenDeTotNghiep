/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unknown-property */

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

import Popup from 'src/components/Popup/Popup'
import useQueryConfig from 'src/hooks/useQueryConfig'

import AdminBlogApi from 'src/apis/adminBlog.api'
import { ProductListConfig } from 'src/types/products.type'

import { Blog } from 'src/types/blog.type'
import AdminBannerApi from 'src/apis/adminBanner.api'
import FormCreateBanner from './components/FormCreateBanner'
import FormEditBanner from './components/FormEditBanner'
import ModalViewBanner from './components/ModalViewBanner'

export default function AdminBlogs() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const [isActionOpen, setIsActionOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState('')
  const [bannerDetail, setBannerDetail] = useState<Blog>()

  // Hàm xử lí khi có kết quả tìm kiếm

  const actionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        // Kiểm tra xem người dùng đã nhấp ra ngoài phần tử chứa nội dung hay không
        setIsActionOpen(false)
      }
    }

    // Thêm sự kiện click ngoài
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      // Loại bỏ sự kiện khi component bị hủy
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [actionRef])

  const queryConfig = useQueryConfig()
  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  console.log(isModalOpen)

  const { data: adminBannerData, refetch } = useQuery({
    queryKey: ['adminBanner', queryConfig],
    queryFn: () => AdminBannerApi.getBanners(queryConfig as ProductListConfig)
  })

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openAction = (productId: string) => {
    setSelectedItemId(productId)

    setIsActionOpen(!isActionOpen)
  }

  const openEditModal = (productId: string) => {
    setIsEditModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
  }

  const openViewModal = async (bannerId: string) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/banners/${bannerId}`) // Thay đổi URL của API theo đường dẫn và tham số cụ thể của bạn
      const bannerData = response.data.data // Dữ liệu chi tiết sản phẩm từ API
      // Lưu trữ dữ liệu chi tiết sản phẩm vào state hoặc hiển thị trực tiếp trong modal
      setBannerDetail(bannerData)

      setIsViewModalOpen(true)
      // Hiển thị modal hoặc thông tin chi tiết sản phẩm theo thiết kế của bạn
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }

  const closeViewModal = () => {
    setIsViewModalOpen(false)
  }

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/admin/banners/${selectedItemId}`)
      // Sau khi xóa thành công, bạn có thể làm các bước sau:
      // 1. Đóng modal xác nhận xóa
      setIsDeleteModalOpen(false)

      const responseData = response.data.message
      // Mở popup khi thành công
      // Cập nhật state với responseData
      setResponseData(responseData)
      openPopup()
      // 2. Cập nhật danh sách sản phẩm bằng cách gọi lại API hoặc cập nhật state nếu có thể
      // 3. Hiển thị thông báo thành công

      refetch()
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error)
      // Hiển thị thông báo lỗi nếu cần
    }
  }

  if (!adminBannerData) return null

  // if (!AdminProductPageSize) return null

  return (
    <div>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />

      {/* <!-- Start block --> */}
      <section className='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased'>
        <div className='flex items-center justify-end mx-12 my-4'>
          <button
            onClick={openModal}
            type='button'
            id='createBlogModalButton'
            data-modal-target='createBlogModal'
            data-modal-toggle='createBlogModal'
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
            Thêm banner
          </button>
          <FormCreateBanner isModalOpen={isModalOpen} closeModal={closeModal} />
        </div>
        <div className='mx-auto max-w-screen-xl px-4 lg:px-12'>
          {/* <!-- Start coding here --> */}
          <div className='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 '>
                  <tr>
                    <th scope='col' className='px-4 py-4 text-center'>
                      Tiêu đề
                    </th>
                    <th scope='col' className='px-4 py-3 text-center'>
                      Ảnh
                    </th>

                    <th scope='col' className='px-4 py-3 text-center'>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {adminBannerData.data.data.map((banner) => (
                    <tr className='border-b dark:border-gray-700' key={banner.id}>
                      <td className='px-4 py-3 text-center'>{banner.title}</td>

                      <td className='px-4 py-3 text-center'>
                        <div className='flex justify-center'>
                          {' '}
                          {/* Sử dụng flexbox để căn giữa */}
                          <img
                            src={`/src/assets/images/banner/${banner.image}`}
                            alt={banner.title}
                            className='h-8 w-auto mr-3'
                          />
                        </div>
                      </td>

                      <td className='px-4 py-3 flex items-center justify-center text-center'>
                        <button
                          onClick={() => openAction(banner.id)}
                          id='apple-imac-27-dropdown-button'
                          data-dropdown-toggle='apple-imac-27-dropdown'
                          className='inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 relative '
                          type='button'
                        >
                          <svg
                            className='w-5 h-5'
                            aria-hidden='true'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z' />
                          </svg>
                          {selectedItemId === banner.id && isActionOpen && (
                            <div
                              ref={actionRef}
                              id='apple-imac-27-dropdown'
                              className='absolute top-8 right-0 z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600'
                            >
                              <ul className='py-1 text-sm' aria-labelledby='apple-imac-27-dropdown-button'>
                                <li>
                                  <button
                                    onClick={() => openEditModal(banner.id)}
                                    type='button'
                                    data-modal-target='updateProductModal'
                                    data-modal-toggle='updateProductModal'
                                    className='flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200'
                                  >
                                    <svg
                                      className='w-4 h-4 mr-2'
                                      xmlns='http://www.w3.org/2000/svg'
                                      viewBox='0 0 20 20'
                                      fill='currentColor'
                                      aria-hidden='true'
                                    >
                                      <path d='M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z' />
                                      <path
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                        d='M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z'
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => openViewModal(banner.id)}
                                    type='button'
                                    data-modal-target='readProductModal'
                                    data-modal-toggle='readProductModal'
                                    className='flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200'
                                  >
                                    <svg
                                      className='w-4 h-4 mr-2'
                                      xmlns='http://www.w3.org/2000/svg'
                                      viewBox='0 0 20 20'
                                      fill='currentColor'
                                      aria-hidden='true'
                                    >
                                      <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                                      <path
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                        d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                                      />
                                    </svg>
                                    Preview
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={openDeleteModal}
                                    type='button'
                                    data-modal-target='deleteModal'
                                    data-modal-toggle='deleteModal'
                                    className='flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400'
                                  >
                                    <svg
                                      className='w-4 h-4 mr-2'
                                      viewBox='0 0 14 15'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                      aria-hidden='true'
                                    >
                                      <path
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                        fill='currentColor'
                                        d='M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z'
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- End block --> */}
      {/* <!-- Create modal --> */}

      {/* <!-- Update modal --> */}
      <FormEditBanner
        isEditModalOpen={isEditModalOpen}
        selectedItemId={selectedItemId}
        closeEditModal={closeEditModal}
        refetchAdminProducts={refetch}
      />
      <ModalViewBanner
        isViewModalOpen={isViewModalOpen}
        closeViewModal={closeViewModal}
        bannerDetail={bannerDetail as Blog}
        openEditModal={openEditModal}
        setIsViewModalOpen={setIsViewModalOpen}
        refetchAdminProducts={refetch}
        selectedItemId={selectedItemId}
      />
      {/* <!-- Delete modal --> */}
      {isDeleteModalOpen && (
        <div
          id='deleteModal'
          tabIndex={-1}
          aria-hidden='true'
          className={`${!isDeleteModalOpen ? 'hidden' : ''} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex  inset-0 bg-gray-800 bg-opacity-80`}
        >
          <div className='relative p-4 w-full max-w-md max-h-full'>
            {/* <!-- Modal content --> */}
            <div className='relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5'>
              <button
                onClick={closeDeleteModal}
                type='button'
                className='text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
                data-modal-toggle='deleteModal'
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
              <svg
                className='text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto'
                aria-hidden='true'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fill-rule='evenodd'
                  d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                  clip-rule='evenodd'
                />
              </svg>
              <p className='mb-4 text-gray-500 dark:text-gray-300'>Bạn có muốn xóa banner này?</p>
              <div className='flex justify-center items-center space-x-4'>
                <button
                  data-modal-toggle='deleteModal'
                  type='button'
                  className='py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600'
                >
                  Không, hủy
                </button>
                <button
                  onClick={handleDelete}
                  type='submit'
                  className='py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900'
                >
                  Có, Tôi đồng ý
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
