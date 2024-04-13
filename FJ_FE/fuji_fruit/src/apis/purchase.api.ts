/* eslint-disable @typescript-eslint/no-unused-vars */
import { Purchase, PurchaseListStatus } from 'src/types/purchase.type'
import { SuccessResponse } from 'src/types/utils.type'
import { getAccessTokenFromLS } from 'src/utils/auth'
import http from 'src/utils/https'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    const token = getAccessTokenFromLS()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    return http.post<SuccessResponse<Purchase>>('/api/purchase/add-to-cart', body, config)
  },

  getPurchases(params: { status: PurchaseListStatus }) {
    const token = getAccessTokenFromLS()
    const config = {
      headers: {
        Authorization: `Bearer ${token}` // Thêm token vào header
      }
    }
    return http.get<SuccessResponse<Purchase[]>>('/api/purchase', {
      ...config,
      params
    })
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    const token = getAccessTokenFromLS()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    return http.post<SuccessResponse<Purchase[]>>('/api/purchase/buy-products', body, config)
  },

  updatePurchase(body: { product_id: string; buy_count: number }) {
    const token = getAccessTokenFromLS()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    return http.put<SuccessResponse<Purchase>>('/api/purchase/update-purchase', body, config)
  },

  deletePurchase(purchaseIds: string[]) {
    const token = getAccessTokenFromLS()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        purchase_ids: purchaseIds
      }
    }
    return http.delete<SuccessResponse<{ deleted_count: number }>>('/api/purchase', config)
  }
}

export default purchaseApi
