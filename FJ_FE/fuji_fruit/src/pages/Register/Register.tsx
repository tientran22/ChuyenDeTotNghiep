/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthApi from 'src/apis/auth.api'

import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { path } from 'src/contains/path'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { getRules, schema, Schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
// c1
// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password' | 'name'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password', 'name'])
function Register() {
  const { setisAuthenticated, setProfile } = useContext(AppContext)
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  // const rules = getRules(getValues) // cach 1

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => AuthApi.registerAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setisAuthenticated(true)
        setProfile(data.data.data.user)
      },
      onError: (error) => {
        console.log(error)
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          console.log(formError)
          if (formError?.email) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError?.password) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
    console.log(data)
  })

  console.log(errors)

  return (
    <div className='bg-primary'>
      <div className='container'>
        <div className='grid grid-cols-1 py-10 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-5 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <h3 className='text-sm lg:text-xl'>Đăng kí</h3>
              <Input
                name='name'
                className='mt-2'
                type='text'
                placeholder='Nhập tên'
                register={register}
                errorMessage={errors.name?.message}
              />

              <Input
                name='email'
                className='mt-2'
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
              <Input
                name='confirm_password'
                className='mt-2'
                type='password'
                placeholder='Nhập lại password'
                register={register}
                errorMessage={errors.confirm_password?.message}
              />
              <Button
                type='submit'
                className='w-full mt-2 p-3 uppercase text-white text-xs bg-primary hover:bg-secondary rounded-sm transition-all flex items-center justify-center'
                disabled={registerAccountMutation.isPending}
                isLoading={registerAccountMutation.isPending}
              >
                Đăng kí
              </Button>
              <div className='flex item-center justify-center mt-4 gap-2'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='text-primary font-semibold hover:text-secondary cursor-pointer  ' to={path.login}>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
