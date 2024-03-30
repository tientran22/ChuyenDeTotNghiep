//* eslint-disable react-hooks/exhaustive-deps */
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import bannerApi from 'src/apis/banner.api'

interface BannerProps {
  autoSlide: boolean
  autoSlideInterval: number
}

export default function Banner({ autoSlide, autoSlideInterval }: BannerProps) {
  const [curr, setCurr] = useState(0)

  const { data: bannersData } = useQuery({
    queryKey: ['banner'],
    queryFn: () => {
      return bannerApi.getBanner()
    }
  })

  const sliders = bannersData?.data?.data ?? []

  const prev = () => {
    setCurr(curr === 0 ? sliders.length - 1 : curr - 1)
  }

  const next = () => {
    setCurr(curr === sliders.length - 1 ? 0 : curr + 1)
  }

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [curr])

  return (
    <div className='overflow-hidden relative'>
      <div
        className='flex items-center transition-transform duration-500 ease-out'
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {sliders.map((slider) => (
          <img
            src={`/src/assets/images/banner/${slider.image}`}
            alt={slider.title}
            key={slider.id}
            className='w-full object-cover'
          />
        ))}
      </div>
      <div className='absolute inset-0 flex items-center justify-between p-4'>
        <button
          onClick={prev}
          className='p-1 rounded-full shadow bg-white text-gray-500 hover:bg-white/60 cursor-pointer'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
          </svg>
        </button>
        <button
          onClick={next}
          className='p-1 rounded-full shadow bg-white text-gray-500 hover:bg-white/60 cursor-pointer z-10'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>
      <div className='absolute bottom-4 left-0 right-0'>
        <div className='flex items-center justify-center gap-2'>
          {sliders.map((_, index) => (
            <div
              key={index}
              className={`transition-all w-3 h-3 bg-primary rounded-full ${curr === index ? 'p-2' : 'bg-primary/50'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
