/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { InputHTMLAttributes } from 'react'
import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegister<any>
  classNameInput?: string
  classNameError?: string
  rules?: RegisterOptions
  errorMessage?: string
}

export default function Input({
  errorMessage,
  name,
  register,
  className,
  type,
  placeholder,
  rules,
  classNameInput = 'p-2 lg:p-3 w-full outline-none border border-gray-300 rounded-sm focus:border-gray-500 focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 text-sm min-h-[1.25rem]',
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input type={type} placeholder={placeholder} className={classNameInput} {...registerResult} {...rest} />
      <p className={classNameError}>{errorMessage}</p>
    </div>
  )
}
