<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class BlogController extends Controller
{
    public function index()
    {
        
        $blogs = Blog::all();
        return response()->json(['message' => 'Lấy tin tức thành công',
        'data' => $blogs,], 200);
    }
    public function store(Request $request)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|string'
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Nếu dữ liệu không hợp lệ, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Tạo sản phẩm mới
        $blog = blog::create([
            'title' => $request->title,
            'content' => $request->content,
            'description' => $request->description,
            'image' => $request->image
            // Thêm các trường khác nếu cần thiết
        ]);

        return response()->json(['message' => 'Thêm tin tức thành công',
        'data' => $blog,], 201);
    }

    public function edit(Request $request, $id)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|string'
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Find the product by ID
        $blog = Blog::findOrFail($id);

        // Update Blog data
        $blog->update($request->all());

        // Return a response
        return response()->json(['message' => 'Sửa tin tức thành công',
        'data' => $blog,], 201);
    }

    public function show($id)
    {
        $blog = Blog::findOrFail($id); // Tìm sản phẩm theo ID

        return response()->json(['message' => 'Lấy thông tin chi tiết sản phẩm thành công',
        'data' => $blog,], 201); // Trả về JSON chứa thông tin của sản phẩm
    }

    public function destroy($id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['message' => 'blog not found'], 404);
        }

        $blog->delete();

        return response()->json(['message' => 'Xóa tin tức thành công']);
    }
}
