export function getOrderStatus(status: string) {
  switch (status) {
    case 'pending':
      return (
        <span className='capitalize py-1 px-2 rounded-md text-xs text-sky-600 bg-sky-100'>
          {status.replace(/_/g, ' ').toLowerCase()}
        </span>
      )
    case 'canceled':
      return (
        <span className='capitalize py-1 px-2 rounded-md text-xs text-orange-600 bg-orange-100'>
          {status.replace(/_/g, ' ').toLowerCase()}
        </span>
      )
    case 'SHIPPED':
      return (
        <span className='capitalize py-1 px-2 rounded-md text-xs text-teal-600 bg-teal-100'>
          {status.replace(/_/g, ' ').toLowerCase()}
        </span>
      )
    case 'OUT_FOR_DELIVERY':
      return (
        <span className='capitalize py-1 px-2 rounded-md text-xs text-yellow-600 bg-yellow-100'>
          {status.replace(/_/g, ' ').toLowerCase()}
        </span>
      )
    case 'success':
      return (
        <span className='capitalize py-1 px-2 rounded-md text-xs text-green-600 bg-green-100'>
          {status.replace(/_/g, ' ').toLowerCase()}
        </span>
      )
    default:
      return (
        <span className='capitalize py-1 px-2 rounded-md text-xs text-gray-600 bg-gray-100'>
          {status.replace(/_/g, ' ').toLowerCase()}
        </span>
      )
  }
}
