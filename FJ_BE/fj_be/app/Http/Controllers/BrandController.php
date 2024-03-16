<?php

namespace App\Http\Controllers;
use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function getAllBrands(Request $request)
    {
    $brands = Brand::all();

    return response()->json([
        'message' => 'Lấy tất cả thương hiệu thành công',
        'data' => $brands
    ]);
}
}
