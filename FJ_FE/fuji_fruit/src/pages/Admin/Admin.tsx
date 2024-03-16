/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { loginAccount } from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { LoginSchema, loginSchema } from 'src/utils/rules'
import { isAxiosUnauthorizedError } from 'src/utils/utils'

type FormData = LoginSchema

export default function Login() {
  const { setisAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        console.log(data.data.data)
        setisAuthenticated(true)
        setProfile(data.data.data.user)
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnauthorizedError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          console.log(formError)
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          if (formError) {
            Object.keys(formError).forEach((key) => {
              console.log(formError[key as keyof FormData])
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
    // console.log(data)
  })

  // console.log(errors)

  return (
    <div className='bg-primary'>
      <div className='container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-5 lg:py-32 lg:pr-10'>
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
                className='w-full mt-2 p-3 uppercase text-white text-xs bg-primary hover:bg-secondary rounded-sm transition-all flex items-center justify-center'
                disabled={loginAccountMutation.isPending}
                isLoading={loginAccountMutation.isPending}
              >
                Đăng Nhập
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
