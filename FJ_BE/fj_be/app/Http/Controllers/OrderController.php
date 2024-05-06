<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;


class OrderController extends Controller
{
    public function store(Request $request)
{
    if (!auth()->check()) {
        return response()->json(['message' => 'Người dùng chưa đăng nhập'], 401);
    }
    // Lấy user_id của người dùng hiện tại
    $userId = auth()->id();
     // Thêm user_id vào dữ liệu đã được xác thực
     
    // Validate request data
    $validatedData = $request->validate([
        'name' => 'required',
        'phone_number' =>'required',
        'total_amount' => 'required',
        'delivery_address' => 'required',
        'note' => 'nullable',
        'items' => 'required|array',
        'items.*.product_id' => 'required',
        'items.*.quantity' => 'required',
        'items.*.price' => 'required', 
    ]);

    $validatedData = array_merge($validatedData, ['user_id' => $userId]);

    

    try {
        // Create new order
        $order = Order::create($validatedData);

        // Save order items
        $order->items()->createMany($validatedData['items']);

        // Return success response
        return response()->json(['message' => 'Đặt hàng thành công', 'order' => $order], 201);
    } catch (\Exception $e) {
        // Return error response
        return response()->json(['message' => 'Có lỗi xảy ra khi đặt hàng', 'error' => $e->getMessage()], 500);
    }
}



public function getOrders(Request $request)
{
    $status = $request->input('status', ''); // Mặc định là 'pending' nếu không có trạng thái nào được chỉ định
    $userId = auth()->id(); // Lấy ID của người dùng hiện tại

    $condition = [
        'user_id' => $userId,
    ];

    if ($status !== '') {
        $condition['status'] = $status;
    }

    $orders = Order::where($condition)
        ->with('items.product') // Sử dụng eager loading để lấy thông tin từ bảng OrderItem và Product
        ->orderByDesc('created_at')
        ->get()
        ->toArray();

    $response = [
        'message' => 'Lấy đơn mua thành công',
        'data' => $orders,
    ];

    return response()->json($response);
}

public function cancelOrder(Request $request, $id)
    {
        // Tìm đơn hàng theo ID
        $order = Order::find($id);

        // Kiểm tra xem đơn hàng có tồn tại không
        if (!$order) {
            return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
        }

      

        // Thực hiện hủy đơn hàng
        $order->status = 'canceled';
        $order->save();

        return response()->json(['message' => 'Đã hủy đơn hàng thành công', 'data' => $order]);
    }



}
