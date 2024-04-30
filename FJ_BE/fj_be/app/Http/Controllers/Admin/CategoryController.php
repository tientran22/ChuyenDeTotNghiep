<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CategoryController extends Controller
{
    public function index()
    {
        
        $categories = Category::all();
        return response()->json(['message' => 'Lấy danh mục thành công',
        'data' => $categories,], 200);
    }
    public function store(Request $request)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Nếu dữ liệu không hợp lệ, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Tạo sản phẩm mới
        $category = Category::create([
            'name' => $request->name,
            
            // Thêm các trường khác nếu cần thiết
        ]);

        return response()->json(['message' => 'Thêm danh mục thành công',
        'data' => $category,], 201);
    }

    public function edit(Request $request, $id)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Find the product by ID
        $category = Category::findOrFail($id);

        // Update category data
        $category->update($request->all());

        // Return a response
        return response()->json(['message' => 'Sửa danh mục  thành công',
        'data' => $category,], 201);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id); // Tìm sản phẩm theo ID

        return response()->json(['message' => 'Lấy thông tin chi tiết danh mục thành công',
        'data' => $category,], 201); // Trả về JSON chứa thông tin của sản phẩm
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Xóa danh mục  thành công']);
    }
}
