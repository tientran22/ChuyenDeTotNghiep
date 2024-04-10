import React from 'react'

export default function AdminProducts() {
  return (
    <div className='my-5'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center bg-gray-200 p-5 rounded-md'>
          <div>
            <h1 className='text-xl font-semibold'>Products ( {total} )</h1>
          </div>
          <div>
            <a href="{route('create')}" className='px-5 py-2 bg-blue-500 rounded-md text-white text-lg shadow-md'>
              Add New
            </a>
          </div>
        </div>
        <div className='flex flex-col'>
          <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
              <div className='overflow-hidden'>
                <table className='min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700'>
                  <thead className='bg-gray-100 dark:bg-gray-700'>
                    <tr>
                      <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                        #
                      </th>
                      <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                        Name
                      </th>
                      <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                        Category
                      </th>
                      <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                        Price
                      </th>
                      <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                        Edit
                      </th>
                      <th scope='col' className='text-sm font-medium text-gray-900 px-6 py-4 text-left'>
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700'>
                    {products.map((product) => (
                      <tr className='hover:bg-gray-100 dark:hover:bg-gray-700' key={product.id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{product.id}</td>
                        <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                          {product.title}
                        </td>
                        <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                          {product.category}
                        </td>
                        <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                          {product.price}
                        </td>
                        <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                          <a
                            href="{route('edit', ['id'=>product.id])}"
                            className='px-5 py-2 bg-blue-500 rounded-md text-white text-lg shadow-md'
                          >
                            Edit
                          </a>
                        </td>
                        <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                          <a
                            href="{route('delete', ['id'=>product.id])}"
                            className='px-5 py-2 bg-red-500 rounded-md text-white text-lg shadow-md'
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td>
                          <h2>Product Not found</h2>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
