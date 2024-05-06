<?php

namespace App\Http\Controllers\Admin;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class UserController extends Controller
{
    // Hiển thị tất cả sản phẩm dưới dạng JSON
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 8);
        
        $query = User::query();

       
    
        $totalUsers = $query->count();
        $totalPages = ceil($totalUsers/$limit);
        $users = $query->paginate($limit, ['*'], 'page', $page);
        return response()->json([
            'message' => 'Lấy tất cả người dùng thành công',
            'data' => [
                'users' => $users->items(),
                'pagination' => [
                    'page' => $users->currentPage(),
                    'limit' => $limit,
                    'page_size' => $totalPages,
                    'total_items' => $totalUsers, // Tổng số sản phẩm sau khi lọc
                ],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'required|string',
            'address' => 'required|string',
            'roles' => 'required|string',
            'email' => 'required|email|unique:users,email', // Thay 'users' bằng tên bảng thực tế
            'avatar' => 'required|string'
        ],
        [
            'email.unique' => 'Địa chỉ email đã được sử dụng.',
        ]);
        
        $password = Str::random(10); // Tạo mật khẩu gồm 10 ký tự ngẫu nhiên

        // Nếu dữ liệu không hợp lệ, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'data' => $validator->errors()], 422);
        }

        // Tạo sản phẩm mới
        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'email' => $request->email,
            'roles' => $request->roles,
            'password' => $password, // Sử dụng mật khẩu ngẫu nhiên
            'avatar' => $request->avatar
            // Thêm các trường khác nếu cần thiết
        ]);

        return response()->json(['message' => 'Thêm người dùng thành công',
        'data' => $user,], 201);
    }

    public function edit(Request $request, $id)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string',
            'roles' => 'required|string',
            'address' => 'required|string',
            'avatar' => 'required|string'
            // Add other validation rules for other fields
        ]);

        // Find the product by ID
        $user = User::findOrFail($id);

         // Update user data
    $user->update($request->only(['name', 'phone', 'address', 'avatar','roles']));

        // Return a response
        return response()->json(['message' => 'Sửa người dùng vào thành công',
        'data' => $user,], 201);
    }

    public function show($id)
    {
        $user = User::findOrFail($id); // Tìm sản phẩm theo ID

        return response()->json(['message' => 'Lấy thông tin chi tiết người dùng thành công',
        'data' => $user,], 201); // Trả về JSON chứa thông tin của sản phẩm
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'user not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Xóa người dùng thành công']);
    }

    public function search(Request $request)
{
    $searchKeyword = $request->query('search');
     // Tìm kiếm sản phẩm dựa trên từ khóa
     

    $page = $request->input('page', 1);
        $limit = $request->input('limit', 8);
    $query = User::query();

    // Áp dụng điều kiện tìm kiếm
    if ($searchKeyword) {
        $query->where('name', 'like', '%' . $searchKeyword . '%');
    }

    $roles = $request->input('roles'); // Lấy vai trò từ request



    if (!$roles || $roles === 'default') {
        // Không làm gì cả
    } else {
        // Nếu vai trò được chỉ định, thêm điều kiện lọc vào truy vấn
        $query->where('roles', $roles);
    }
    
    $totalUsers = $query->count();
    $totalPages = ceil($totalUsers/$limit);
    $users = $query->paginate($limit, ['*'], 'page', $page);
    // Lấy kết quả

    return response()->json(['data' => [
        'users' => $users->items(),
        'pagination' => [
            'page' => $users->currentPage(),
            'limit' => $limit,
            'page_size' => $totalPages,
            'total_items' => $totalUsers, // Tổng số sản phẩm sau khi lọc
        ],
    ]]);
}

}

