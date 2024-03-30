/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/components/Button'
import QuantityController from 'src/components/QuantityController'
import { path } from 'src/contains/path'
import { purchaseStatus } from 'src/contains/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { current, produce } from 'immer'
import { keyBy } from 'lodash'
import Popup from 'src/components/Popup/Popup'

interface ExtendedPurchase extends Purchase {
  disable: boolean
  checked: boolean
}

export default function Cart() {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false)
  const [responseData, setResponseData] = useState<string>('') // Khởi tạo state để lưu trữ responseData
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>([])
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })

  const updatePurchasesMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      const responseData = data.data.message
      console.log(data.data.message)
      // Mở popup khi thành công
      // Cập nhật state với responseData
      setResponseData(responseData)
      openPopup()
      refetch()
    }
  })

  const openPopup = () => {
    setIsPopupOpen(true)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: (data) => {
      const responseData = data.data.message
      console.log(data.data.message)
      // Mở popup khi thành công
      // Cập nhật state với responseData
      setResponseData(responseData)
      openPopup()
      refetch()
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = checkedPurchases.reduce((result, current) => {
    return result + current.product.price * current.buy_count
  }, 0)

  const totalCheckedPurchaseSavingPrice = checkedPurchases.reduce((result, current) => {
    if (current.product.price_before_discount !== 0) {
      result = result + (current.product.price_before_discount - current.product.price) * current.buy_count
    }
    return result
  }, 0)

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, 'id')
      return (
        purchasesInCart?.map((purchase) => {
          return {
            ...purchase,
            disable: false,
            checked: Boolean(extendedPurchasesObject[purchase.id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart])

  const handleCheck = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }
  const handleCheckALL = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disable = true
        })
      )
      updatePurchasesMutation.mutate({ product_id: purchase.product.id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDelete = (purchaseIndex: number, openPopup: () => void) => () => {
    const purchaseId = extendedPurchases[purchaseIndex].id
    deletePurchasesMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchase = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase.id)
    deletePurchasesMutation.mutate(purchaseIds)
  }

  const handleBuyProducts = (openPopup: () => void) => () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product.id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <Popup message={responseData} isOpen={isPopupOpen} onClose={closePopup} />
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      name=''
                      className='h-4 w-4 accent-primary'
                      checked={isAllChecked}
                      onChange={handleCheckALL}
                    />
                  </div>
                  <div className='flex-grow'>Sản phẩm</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Đơn giá</div>
                  <div className='col-span-1'>Số lượng</div>
                  <div className='col-span-1'>Số tiền</div>
                  <div className='col-span-1'>Thao tác</div>
                </div>
              </div>
            </div>

            <div className='my-3 rounded-sm  shadow'>
              {extendedPurchases?.map((purchase, index) => (
                <div
                  key={purchase.id}
                  className='first:mt-0 mt-3 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-9 text-sm text-primary'
                >
                  <div className='col-span-6'>
                    <div className='flex'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          name=''
                          className='h-4 w-4 accent-primary'
                          checked={purchase.checked}
                          onChange={handleCheck(index)}
                        />
                      </div>
                      <div className='flex-grow'>
                        <div className='flex'>
                          <Link
                            to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product.id })}`}
                            className='w-20 h-20 flex-shrink-0'
                          >
                            <img
                              className='w-20 h-20 object-cover'
                              src={`/src/assets/images/products/${purchase.product.image}`}
                              alt={purchase.product.name}
                            />
                          </Link>
                          <div className='flex-grow px-2 pt-1 pb-2'>
                            <Link
                              className='line-clamp-2 text-xl'
                              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product.id })}`}
                            >
                              {purchase.product.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-span-6 text-center'>
                    <div className='grid grid-cols-5 items-center'>
                      <div className='col-span-2'>
                        <div className='flex items-center justify-center'>
                          <span className='text-gray-300 line-through'>
                            {purchase.product.price_before_discount === 0
                              ? ''
                              : `₫${formatCurrency(purchase.product.price_before_discount)}`}
                          </span>
                          <span className=' ml-3 '>₫{formatCurrency(purchase.product.price)}</span>
                        </div>
                      </div>

                      <div className='col-span-1'>
                        <QuantityController
                          max={purchase.product.quantity}
                          value={purchase.buy_count}
                          onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                          onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                          disabled={purchase.disable}
                          onFocusOut={(value) =>
                            handleQuantity(
                              index,
                              value,
                              value <= purchase.product.quantity &&
                                value >= 1 &&
                                value !== (purchasesInCart as Purchase[])[index].buy_count
                            )
                          }
                          onType={handleTypeQuantity(index)}
                          classNameWrapper='flex items-center'
                        />
                      </div>

                      <div className='col-span-1 font-semibold'>
                        <span className='text-primary'>
                          {' '}
                          ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                        </span>
                      </div>

                      <div className='col-span-1'>
                        <button
                          onClick={handleDelete(index, openPopup)}
                          className='bg-none text-black transition-colors hover:text-primary '
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='sticky bottom-0 z-10 flex flex-col sm:flex-row sm:items-center rounded-sm bg-white p-5 border border-gray-100 mt-5'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                name=''
                className='h-4 w-4 accent-primary'
                checked={isAllChecked}
                onChange={handleCheckALL}
              />
            </div>
            <button onClick={handleCheckALL} className='mx-3 bg-none border-none hover:text-primary'>
              Chọn tất cả ({extendedPurchases.length})
            </button>
            <button onClick={handleDeleteManyPurchase} className='mx-3 bg-none border-none hover:text-primary'>
              Xóa
            </button>
          </div>
          <div className='sm:ml-auto flex flex-col sm:flex-row items-center mt-4 sm:mt-0'>
            <div>
              <div className='flex items-center sm:justify-end'>
                <div>Tổng sản phẩm ({checkedPurchasesCount} sản phẩm)</div>
                <div className='ml-2 text-1xl sm:text-2xl text-primary'>
                  {totalCheckedPurchasePrice ? `₫${totalCheckedPurchasePrice}` : ''}
                </div>
              </div>
              <div className='flex items-center justify-end text-xs sm:text-sm'>
                <div className='text-gray-500'>Tiết kiệm</div>
                <div className='ml-6 text-primary'>
                  {totalCheckedPurchaseSavingPrice ? `₫${totalCheckedPurchaseSavingPrice}` : ''}
                </div>
              </div>
            </div>
            <Button
              onClick={handleBuyProducts(openPopup)}
              className='mt-5 sm:mt-0 sm:ml-4 h-10 w-48 uppercase text-white text-xs bg-primary hover:bg-primary/80 rounded-sm transition-all flex items-center justify-center'
            >
              Mua hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
