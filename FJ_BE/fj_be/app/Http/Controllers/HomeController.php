<?php
namespace App\Http\Controllers;

use App\Models\Product;

class HomeController extends Controller
{
    public function getProductsImport()
    {
        // Lấy tất cả các sản phẩm có category_id là 2
        $products = Product::where('brand_id', 2)->get();
        
        return response()->json([
            'message' => 'Lấy sản phẩm nhập khẩu thành công',
            'data' => $products
        ]);
    }

    public function getProductsGift()
    {
        // Lấy tất cả các sản phẩm có category_id là 2
        $products = Product::where('category_id', 1)->get();
        
        return response()->json([
            'message' => 'Lấy sản phẩm quà tặng thành công',
            'data' => $products
        ]);
    }
}

