/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import blogApi from 'src/apis/blog.api'
import { getIdFromBlogId } from 'src/utils/utils'

export default function BlogDetail() {
  const { blogId } = useParams()
  const id = getIdFromBlogId(blogId as string) // Sử dụng getIdFromNameId() để lấy id từ nameId

  // Sử dụng useQuery để lấy dữ liệu của blog
  const { data: blogDetailData } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogApi.getBlogDetail(id as string)
  })
  const blog = blogDetailData?.data.data
  console.log(blog)
  if (!blog) return null
  return (
    <div className='py-16 bg-slate-100'>
      <div className='container'>
        <div className='font-semibold text-3xl'>{blog?.title}</div>
        <div className='font-semibold my-4'>{blog?.description}</div>
        <div
          className='prose mt-4'
          dangerouslySetInnerHTML={{
            __html: blog?.content as string
          }}
        ></div>
      </div>
    </div>
  )
}
