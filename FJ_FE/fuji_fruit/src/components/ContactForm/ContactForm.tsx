/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import Button from '../Button'
import { useMutation } from '@tanstack/react-query'
import contactApi from 'src/apis/contact.api'
import { contactSchema } from 'src/utils/rules'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '../Input'
import Popup from '../Popup/Popup'

type FormData = Pick<contactSchema, 'name' | 'email_address' | 'message'>

function ContactForm() {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(contactSchema)
  })
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const [formData, setFormData] = useState({
    name: '',
    email_address: '',
    message: ''
  })

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const ContactMutation = useMutation({
    mutationFn: (body: FormData) => contactApi.contactForm(body),
    onSuccess: (data) => {
      const responseData = data.data.message
      console.log(data.data.message)
      // Mở popup khi thành công
      // Cập nhật state với responseData
      setResponseData(responseData)
      openPopup()
    },
    onError: (data) => {
      console.log(data)
    }
  })
  const { name, email_address, message } = formData

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setFormData({
      ...formData,
      message: newValue
    })
  }

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    ContactMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data)
      },
      onError: (data) => {
        console.log(data)
      }
    })

    // Gửi dữ liệu lên server
    // ContactMutation.mutate(
    //   {
    //     name: name,
    //     email_address: email_address,
    //     message: message
    //   },
    //   {
    //     onSuccess: (data) => {
    //       console.log(123)
    //     }
    //   }
  })

  //   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault()
  //     try {
  //       const res = await http.post('/api/send-email', formData)
  //       console.log(res.data) // Hiển thị phản hồi từ API
  //       // Xử lý phản hồi ở đây (ví dụ: hiển thị thông báo cho người dùng)
  //     } catch (err: any) {
  //       console.error(err.response.data) // Hiển thị lỗi từ API nếu có
  //     }
  //   }
  return (
    <div className='container mx-auto py-4 bg-white shadow-xl rounded-md'>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />

      <h2 className='text-2xl font-semibold mb-4'>Liên hệ</h2>
      <form onSubmit={onSubmit} noValidate>
        <div className='mb-4'>
          <Input
            type='text'
            id='name'
            name='name'
            value={name}
            onChange={handleChange}
            errorMessage={errors.name?.message}
            register={register}
            placeholder='Tên của bạn'
          />
        </div>
        <div className='mb-4'>
          <Input
            type='text'
            id='email'
            name='email_address'
            onChange={handleChange}
            errorMessage={errors.email_address?.message}
            register={register}
            placeholder='Email của bạn'
            value={email_address}
          />
        </div>
        <div className='mb-4'>
          <textarea
            {...register('message')}
            id='message'
            name='message'
            placeholder='Nhập nội dung'
            rows={4}
            value={message}
            onChange={handleTextAreaChange}
            className='w-full px-3 py-2 border rounded-md outline-slate-200'
          ></textarea>
          {errors.message && (
            <span className='mt-1 text-red-600 text-sm min-h-[1.25rem]'>{errors.message.message}</span>
          )}
        </div>
        <div className='flex items-center justify-end'>
          <Button
            isLoading={ContactMutation.isPending}
            disabled={ContactMutation.isPending}
            type='submit'
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md'
          >
            Gửi
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ContactForm
