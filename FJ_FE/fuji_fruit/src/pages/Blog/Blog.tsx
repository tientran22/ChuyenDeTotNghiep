import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Link } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import { path } from 'src/contains/path'
import { generateNameId } from 'src/utils/utils'

export default function Blog() {
  const { data: blogData } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getBlog()
  })
  console.log(blogData)
  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          {blogData?.data.data.map((blog) => (
            <Link
              to={`${path.blog}/${generateNameId({ name: blog.title, id: blog.id })}`}
              className='flex flex-col items-center gap-4  shadow-md'
              key={blog.id}
            >
              <div className='w-full pt-[100%] relative'>
                <img
                  src={`/src/assets/images/products/${blog.image}`}
                  alt=''
                  className='absolute w-full h-full top-0 left-0 hover:opacity-80 cursor-pointer'
                />
              </div>
              <div className='p-2'>
                <div className='font-semibold text-primary cursor-pointer w-full hover:text-primary/90 text-left'>
                  {blog.title}
                </div>
                <p className='text-sm mt-4 line-clamp-4'>{blog.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
