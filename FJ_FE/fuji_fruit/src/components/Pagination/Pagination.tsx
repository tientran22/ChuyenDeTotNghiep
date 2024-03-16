/* eslint-disable @typescript-eslint/no-unused-vars */

import classNames from 'classnames'

import { Link, createSearchParams } from 'react-router-dom'
import { path } from 'src/contains/path'
import { queryConfig } from 'src/hooks/useQueryConfig'

/**
Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page

[1] 2 3 ... 19 20
1 [2] 3 4 ... 19 20 
1 2 [3] 4 5 ... 19 20
1 2 3 [4] 5 6 ... 19 20
1 2 3 4 [5] 6 7 ... 19 20

1 2 ... 4 5 [6] 8 9 ... 19 20

1 2 ...13 14 [15] 16 17 ... 19 20


1 2 ... 14 15 [16] 17 18 19 20
1 2 ... 15 16 [17] 18 19 20
1 2 ... 16 17 [18] 19 20
1 2 ... 17 18 [19] 20
1 2 ... 18 19 [20]
 */
interface Props {
  queryConfig: queryConfig
  pageSize: number
}

const RANGE = 2

export default function Pagination({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false
    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm'>
            ...
          </span>
        )
      }
      return null
    }
    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span key={index} className='mx-2 rounded border bg-white px-3 py-2 shadow-sm '>
            ...
          </span>
        )
      }
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotAfter(index)
          }
        } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotBefore(index)
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotAfter(index)
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames(
              'px-4 py-2 bg-white rounded-sm shadow-sm mx-2 cursor-pointer border hover:bg-primary hover:text-white',
              {
                'border-primary': pageNumber === page,
                'border-transparent': pageNumber !== page
              }
            )}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <div className='flex flex-wrap mt-6 justify-center'>
      {page === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm hover:bg-primary hover:text-white'
        >
          Prev
        </Link>
      )}
      {renderPagination()}
      {page === pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm '>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm hover:bg-primary hover:text-white'
        >
          Next
        </Link>
      )}
    </div>
  )
}
