<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\HomeController;




/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/auth/register', [AuthController::class, 'createUser']);
Route::post('/auth/login', [AuthController::class, 'loginUser']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('products/{id}', [ProductController::class, 'getProductDetail']);


// Route::get('/products', [ProductController::class, 'searchProducts']);


Route::get('/category', [CategoryController::class, 'getAllCategories']);
Route::get('/brand', [BrandController::class, 'getAllBrands']);

// Cart
Route::post('/purchase/add-to-cart', [CartController::class, 'addToCart'])->middleware('auth:sanctum');
Route::get('/purchase', [CartController::class, 'getPurchases'])->middleware('auth:sanctum');
Route::put('/purchase/update-purchase', [CartController::class, 'updatePurchase'])->middleware('auth:sanctum');
Route::delete('/purchase', [CartController::class, 'deletePurchases'])->middleware('auth:sanctum');
Route::post('/purchase/buy-products', [CartController::class, 'buyProducts'])->middleware('auth:sanctum');
// Banners
Route::get('/banner', [BannerController::class, 'getAllBanners']);
// Home
Route::get('/home/getProductsImport', [HomeController::class, 'getProductsImport']);
Route::get('/home/getProductsGift', [HomeController::class, 'getProductsGift']);






 












