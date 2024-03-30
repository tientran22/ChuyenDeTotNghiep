<?php
namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function getAllBanners()
    {
        $banners = Banner::all(); // Lấy tất cả các banner từ cơ sở dữ liệu
        return response()->json([
            'message' => 'Lấy tất cả banner thành công',
        'data' => $banners]);
    }
}

