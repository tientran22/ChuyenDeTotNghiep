<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;

use Illuminate\Support\Facades\Validator;


class OrderController extends Controller
{
    // Hiển thị tất cả sản phẩm dưới dạng JSON
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 8);
        

        // Tìm kiếm sản phẩm dựa trên từ khóa
        $query = Order::query();
        
        $totalOrders = $query->count();
        $totalPages = ceil($totalOrders/$limit);
        $orders = $query->paginate($limit, ['*'], 'page', $page);
        return response()->json([
            'message' => 'Lấy tất cả đơn hàng thành công',
            'data' => [
                'orders' => $orders->items(),
                'pagination' => [
                    'page' => $orders->currentPage(),
                    'limit' => $limit,
                    'page_size' => $totalPages,
                    'total_items' => $totalOrders, // Tổng số sản phẩm sau khi lọc
                ],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string',
            'delivery_address' => 'required|string',
            'total_amount' => 'required|integer|min:0',
            'user_id' => 'required|integer', // Thay 'users' bằng tên bảng thực tế
            'status' => 'required|string',
        ],);
        


        // Nếu dữ liệu không hợp lệ, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'data' => $validator->errors()], 422);
        }

        // Tạo sản phẩm mới
        $order = Order::create([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'delivery_address' => $request->delivery_address,
            'status' => $request->status,
            'user_id' => $request->user_id,
            'total_amount' => $request->total_amount, // Sử dụng mật khẩu ngẫu nhiên
            'note' => $request->note
            // Thêm các trường khác nếu cần thiết
        ]);

        return response()->json(['message' => 'Thêm đơn hàng thành công',
        'data' => $order,], 201);
    }

    public function edit(Request $request, $id)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string',
            'delivery_address' => 'required|string',
            'total_amount' => 'required|integer|min:0',
            'user_id' => 'required|integer', // Thay 'users' bằng tên bảng thực tế
            'status' => 'required|string',
            // Add other validation rules for other fields
        ]);

        // Find the product by ID
        $order = Order::findOrFail($id);

         // Update order data
    $order->update($request->only(['name', 'phone_number', 'delivery_address', 'total_amount','status', 'user_id','note']));

        // Return a response
        return response()->json(['message' => 'Sửa đơn hàng vào thành công',
        'data' => $order,], 201);
    }

    public function show($id)
    {
        $order = Order::findOrFail($id); // Tìm sản phẩm theo ID

        return response()->json(['message' => 'Lấy thông tin chi tiết đơn hàng thành công',
        'data' => $order,], 201); // Trả về JSON chứa thông tin của sản phẩm
    }

    public function destroy($id)
    {
        // Xóa tất cả các hàng con từ bảng order_items trước
        OrderItem::where('order_id', $id)->delete();
    
        // Sau đó, bạn có thể xóa đơn hàng từ bảng orders
        $order = Order::find($id);
    
        if (!$order) {
            return response()->json(['message' => 'order not found'], 404);
        }
    
        $order->delete();
    
        return response()->json(['message' => 'Xóa đơn hàng thành công']);
    }
    

    public function search(Request $request)
{
    $searchKeyword = $request->query('search');
 

    $page = $request->input('page', 1);
        $limit = $request->input('limit', 8);
    $query = Order::query();

    // Áp dụng điều kiện tìm kiếm
    if ($searchKeyword) {
        $query->where('name', 'like', '%' . $searchKeyword . '%');
    }
    $status = $request->input('status');
        if (!$status || $status === 'default') {
            // Khong lam gi ca
        } else  {
            $query->where('status', $status);

        }

    
    
    $totalOrders = $query->count();
    $totalPages = ceil($totalOrders/$limit);
    $orders = $query->paginate($limit, ['*'], 'page', $page);
    // Lấy kết quả

    return response()->json(['data' => [
        'orders' => $orders->items(),
        'pagination' => [
            'page' => $orders->currentPage(),
            'limit' => $limit,
            'page_size' => $totalPages,
            'total_items' => $totalOrders, // Tổng số sản phẩm sau khi lọc
        ],
    ]]);
}

public function updateStatus(Request $request, $id)
{
    // Validate request data
    $validator = Validator::make($request->all(), [
        'status' => 'required|string|in:success', // Chỉ cho phép cập nhật sang trạng thái "access"
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Validation failed', 'data' => $validator->errors()], 422);
    }

    // Tìm đơn hàng theo ID
    $order = Order::find($id);

    // Kiểm tra xem đơn hàng có tồn tại không
    if (!$order) {
        return response()->json(['message' => 'Đơn hàng không tồn tại'], 404);
    }

    // Cập nhật trạng thái của đơn hàng thành "access"
    $order->status = 'success';
    $order->save();

    return response()->json(['message' => 'Cập nhật trạng thái đơn hàng thành công', 'data' => $order]);
}

}

