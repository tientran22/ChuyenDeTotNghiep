<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getAllCategories(Request $request)
    {
        $categories = Category::all();

    return response()->json([
        'message' => 'Lấy tất cả danh mục thành công',
        'data' => $categories
    ]);
    }
}
