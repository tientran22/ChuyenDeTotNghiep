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

    public function updatePurchase(Request $request)
    {
        $input = $request->only(['product_id', 'buy_count']);
        
        $purchaseInDb = Purchase::where('user_id', auth()->id())
            ->where('status', -1)
            ->whereHas('product', function ($query) use ($input) {
                $query->where('id', $input['product_id']);
            })
            ->with('product.category')
            ->first();

        if ($purchaseInDb) {
            if ($input['buy_count'] > $purchaseInDb->product->quantity) {
                return response()->json(['error' => 'Số lượng vượt quá số lượng sản phẩm'], 406);
            }

            $purchaseInDb->update([
                'buy_count' => $input['buy_count']
            ]);

            // $purchaseInDb->refresh();

            $response = [
                'message' => 'Cập nhật đơn thành công',
                'data' => $purchaseInDb
            ];

            return response()->json($response);
        } else {
            return response()->json(['error' => 'Không tìm thấy đơn'], 406);

        }
    }

    public function deletePurchases(Request $request)
    {
    // Lấy danh sách purchase_ids từ yêu cầu
    $purchase_ids = $request->input('purchase_ids');
        
    // Lấy user_id của người dùng hiện tại
    $user_id = auth()->id();

    // Kiểm tra xem purchase_ids có tồn tại không
    if (empty($purchase_ids)) {
        return response()->json(['error' => 'Không có purchase_ids được cung cấp.'], 400);
    }

    // Xóa các đơn mua có user_id và status đúng, và có id nằm trong danh sách purchase_ids
    $deletedData = Purchase::where('user_id', $user_id)
        ->where('status', -1)
        ->whereIn('id', $purchase_ids)
        ->delete();

    // Trả về thông báo thành công và số lượng đơn đã xóa
    return response()->json([
        'message' => "Xoá $deletedData đơn thành công",
        'data' => ['deleted_count' => $deletedData],
    ]);
    }
    public function buyProducts(Request $request) {
        $purchases = [];
    
        foreach ($request->input() as $item) {
            $product = Product::find($item['product_id']);
    
            if ($product) {
                if ($item['buy_count'] > $product->quantity) {
                    return response()->json(['error' => 'Số lượng mua vượt quá số lượng sản phẩm'], 406);
                } else {
                    $purchase = Purchase::where('user_id', auth()->id())
                        ->where('status', -1)
                        ->where('product_id', $item['product_id'])
                        ->first();
    
                    if ($purchase) {
                        $purchase->update([
                            'buy_count' => $item['buy_count'],
                            'status' => -2
                        ]);
                        $data = $purchase->load('product.category');
                    } else {
                        $purchase = Purchase::create([
                            'user_id' => auth()->id(),
                            'product_id' => $item['product_id'],
                            'buy_count' => $item['buy_count'],
                            'price' => $product->price,
                            'price_before_discount' => $product->price_before_discount,
                            'status' => -2
                        ]);
                        $data = $purchase->load('product.category');
                    }
                    $purchases[] = $data;
                }
            } else {
                return response()->json(['error' => 'Không tìm thấy sản phẩm'], 404);
            }
        }
    
        return response()->json([
            'message' => 'Mua sản phẩm thành công',
            'data' => $purchases
        ]);
    }

}
