<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class BrandController extends Controller
{
    public function index()
    {
        
        $brands = Brand::all();
        return response()->json(['message' => 'Lấy thương thành công',
        'data' => $brands,], 200);
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
        $brand = Brand::create([
            'name' => $request->name,
            
            // Thêm các trường khác nếu cần thiết
        ]);

        return response()->json(['message' => 'Thêm thương hiệu thành công',
        'data' => $brand,], 201);
    }

    public function edit(Request $request, $id)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Find the product by ID
        $brand = Brand::findOrFail($id);

        // Update brand data
        $brand->update($request->all());

        // Return a response
        return response()->json(['message' => 'Sửa thương hiệu  thành công',
        'data' => $brand,], 201);
    }

    public function show($id)
    {
        $brand = Brand::findOrFail($id); // Tìm sản phẩm theo ID

        return response()->json(['message' => 'Lấy thông tin chi tiết thương hiệu thành công',
        'data' => $brand,], 201); // Trả về JSON chứa thông tin của sản phẩm
    }

    public function destroy($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['message' => 'brand not found'], 404);
        }

        $brand->delete();

        return response()->json(['message' => 'Xóa thương hiệu  thành công']);
    }
}
