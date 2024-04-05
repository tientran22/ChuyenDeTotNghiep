<?php

namespace App\Http\Controllers;
use App\Models\Blog;

use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function getAllBlog() {
        $blogs = Blog::all();

    return response()->json([
        'message' => 'Lấy tất cả tin tức thành công',
        'data' => $blogs
    ]);
    }

    public function getBlogDetail($blogId)
{
    // Lấy thông tin của bài viết blog dựa trên ID
    $blog = Blog::findOrFail($blogId);

    // Trả về dữ liệu của bài viết blog dưới dạng JSON
    return response()->json([ 
        'message' => 'Lấy tin tức chi tiết thành công',
        'data' => $blog 
    ]);
}
}
