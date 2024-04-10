import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import AuthApi from 'src/apis/auth.api'
import AnimationText from 'src/components/AnimationText'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { path } from 'src/contains/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rules'
import { isAxiosUnauthorizedError } from 'src/utils/utils'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setisAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => AuthApi.loginAccount(body),
    onSuccess: (data) => {
      const userData = data.data.data.user // Lấy dữ liệu người dùng từ response
      console.log(data)
      setisAuthenticated(true)
      setProfile(userData)

      if (userData.roles.includes('admin')) {
        navigate('/admin') // Điều hướng đến trang admin nếu người dùng có vai trò là admin
      } else {
        navigate('/') // Điều hướng đến trang chính nếu người dùng không phải là admin
      }
    },
    onError: (error) => {
      console.log(error)
      if (isAxiosUnauthorizedError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        console.log(formError)
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data)
  })

  return (
    <div className='bg-gradient-to-b from-green-600 to-blue-800'>
      <div className='container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 text-white uppercase '>
            <AnimationText text='Chúng tôi' className='text-5xl text-left mt-4 font-normal' startDelay={1} />
            <AnimationText text='chỉ' className='text-9xl text-center mt-4 font-bold' startDelay={2} />
            <AnimationText text='bán hoa quả' className='text-5xl text-center mt-4 font-normal' startDelay={3} />
            <AnimationText text='sạch' className='text-9xl text-right mt-4 font-bold' startDelay={5} />
          </div>

          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-5 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <h3 className='text-sm lg:text-xl'>Đăng nhập</h3>
              <Input
                name='email'
                className='mt-4'
                type='email'
                placeholder='Nhập email'
                register={register}
                errorMessage={errors.email?.message}
              />

              <Input
                name='password'
                className='mt-2'
                type='password'
                placeholder='Nhập password'
                register={register}
                errorMessage={errors.password?.message}
              />
              <Button
                type='submit'
                className='w-full mt-2 p-3 uppercase text-white text-xs bg-primary hover:bg-primary/80 rounded-sm transition-all flex items-center justify-center'
                disabled={loginAccountMutation.isPending}
                isLoading={loginAccountMutation.isPending}
              >
                Đăng Nhập
              </Button>

              <div className='flex item-center justify-center mt-4 gap-2'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='text-primary font-semibold hover:text-secondary cursor-pointer  ' to={path.register}>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
