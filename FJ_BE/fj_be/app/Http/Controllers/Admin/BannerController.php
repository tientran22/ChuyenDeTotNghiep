<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class BannerController extends Controller
{
    public function index()
    {
        
        $banners = Banner::all();
        return response()->json(['message' => 'Lấy banner thành công',
        'data' => $banners,], 200);
    }
    public function store(Request $request)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'image' => 'required|string'
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Nếu dữ liệu không hợp lệ, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Tạo sản phẩm mới
        $banner = Banner::create([
            'title' => $request->title,
            'image' => $request->image
            // Thêm các trường khác nếu cần thiết
        ]);

        return response()->json(['message' => 'Thêm banner thành công',
        'data' => $banner,], 201);
    }

    public function edit(Request $request, $id)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'image' => 'required|string'
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Find the product by ID
        $banner = Banner::findOrFail($id);

        // Update banner data
        $banner->update($request->all());

        // Return a response
        return response()->json(['message' => 'Sửa banner thành công',
        'data' => $banner,], 201);
    }

    public function show($id)
    {
        $banner = Banner::findOrFail($id); // Tìm sản phẩm theo ID

        return response()->json(['message' => 'Lấy thông tin chi tiết sản phẩm thành công',
        'data' => $banner,], 201); // Trả về JSON chứa thông tin của sản phẩm
    }

    public function destroy($id)
    {
        $banner = Banner::find($id);

        if (!$banner) {
            return response()->json(['message' => 'banner not found'], 404);
        }

        $banner->delete();

        return response()->json(['message' => 'Xóa banner thành công']);
    }
}
