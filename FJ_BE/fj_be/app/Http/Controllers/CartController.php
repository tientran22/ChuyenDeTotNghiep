<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;


class CartController extends Controller
{
    public function addToCart(Request $request)
    {
        $requestData = $request->only(['product_id', 'buy_count']);
        $productId = $requestData['product_id'];
        $buyCount = $requestData['buy_count'];
        $product = Product::find($productId);

        if ($product) {
            if ($buyCount > $product->quantity) {
                return response()->json(['error' => 'Số lượng vượt quá số lượng sản phẩm'], 406);
            }

            $purchaseInDb = Purchase::where('user_id', auth()->id())
                                    ->where('status', -1)
                                    ->where('product_id', $productId)
                                    ->with('product.category')
                                    ->first();

            if ($purchaseInDb) {
                $purchaseInDb->buy_count += $buyCount;
                $purchaseInDb->save();
                $data = $purchaseInDb->load('product.category');
            } else {
                $purchase = [
                    'user_id' => auth()->id(),
                    'product_id' => $productId,
                    'buy_count' => $buyCount,
                    'price' => $product->price,
                    'price_before_discount' => $product->price_before_discount,
                    'status' => -1,
                ];

                $addedPurchase = Purchase::create($purchase);
                $data = $addedPurchase->load('product.category');
            }

            $response = [
                'message' => 'Thêm sản phẩm vào giỏ hàng thành công',
                'data' => $data,
            ];

            return response()->json($response);
        } else {
            throw new CustomException('Không tìm thấy sản phẩm', 404);
        }
    }

    public function getPurchases(Request $request)
    {
        $status = $request->input('status', 'ALL');
        $userId = auth()->id(); // Lấy ID của người dùng hiện tại

        $condition = [
            'user_id' => $userId,
        ];

        if ($status !== 'ALL') {
            $condition['status'] = $status;
        }

        $purchases = Purchase::where($condition)
            ->with('product.category') // Sử dụng eager loading để lấy thông tin sản phẩm và danh mục
            ->orderByDesc('created_at')
            ->get()
            ->toArray();


        $response = [
            'message' => 'Lấy đơn mua thành công',
            'data' => $purchases,
        ];

        return response()->json($response);
    }
}
