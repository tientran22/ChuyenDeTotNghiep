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
use App\Http\Controllers\BlogController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\BlogController as AdminBlogController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;









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
Route::post('/auth/login', [AuthController::class, 'loginUser'])->middleware('admin');
Route::get('auth', [AuthController::class, 'redirectToAuth']);
Route::get('auth/callback', [AuthController::class, 'handleAuthCallback']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::get('/products', [ProductController::class, 'getProducts']);
Route::get('products/{productId}', [ProductController::class, 'getProductDetail']);


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
Route::get('/home/getProductsBestSeller', [HomeController::class, 'getProductsBestSeller']);
// Blog
Route::get('/blog', [BlogController::class, 'getAllBlog']);
Route::get('/blog/{blogId}',[BlogController::class, 'getBlogDetail']);


// Order


Route::post('/orders', [OrderController::class, 'store'])->middleware('auth:sanctum');
Route::get('/orders', [OrderController::class, 'getOrders'])->middleware('auth:sanctum');
Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);


// Contact


Route::post('/send-email', [ContactController::class, 'sendEmail']);







Route::prefix('admin')->group(function () {
    // Products
    Route::get('products', [AdminProductController::class, 'index']);
    Route::get('products/create', [AdminProductController::class, 'create']);
    Route::post('products', [AdminProductController::class, 'store']);
    Route::get('products/{id}/edit', [AdminProductController::class, 'edit']);
    Route::put('products/{id}', [AdminProductController::class, 'edit']);
    Route::get('products/search', [AdminProductController::class, 'search']);
    Route::get('products/{id}', [AdminProductController::class, 'show']);
    Route::delete('products/{id}', [AdminProductController::class, 'destroy']);
    // Users
    Route::get('users', [AdminUserController::class, 'index']);
    Route::get('users/create', [AdminUserController::class, 'create']);
    Route::post('users', [AdminUserController::class, 'store']);
    Route::get('users/{id}/edit', [AdminUserController::class, 'edit']);
    Route::put('users/{id}', [AdminUserController::class, 'edit']);
    Route::get('users/search', [AdminUserController::class, 'search']);
    Route::get('users/{id}', [AdminUserController::class, 'show']);
    Route::delete('users/{id}', [AdminUserController::class, 'destroy']);
    // Blog
    Route::get('blogs', [AdminBLogController::class, 'index']);
    Route::get('blogs/create', [AdminBLogController::class, 'create']);
    Route::post('blogs', [AdminBLogController::class, 'store']);
    Route::get('blogs/{id}/edit', [AdminBLogController::class, 'edit']);
    Route::put('blogs/{id}', [AdminBLogController::class, 'edit']);
    Route::get('blogs/{id}', [AdminBLogController::class, 'show']);
    Route::delete('blogs/{id}', [AdminBLogController::class, 'destroy']);
    // Banner
    Route::get('banners', [AdminBannerController::class, 'index']);
    Route::get('banners/create', [AdminBannerController::class, 'create']);
    Route::post('banners', [AdminBannerController::class, 'store']);
    Route::get('banners/{id}/edit', [AdminBannerController::class, 'edit']);
    Route::put('banners/{id}', [AdminBannerController::class, 'edit']);
    Route::get('banners/{id}', [AdminBannerController::class, 'show']);
    Route::delete('banners/{id}', [AdminBannerController::class, 'destroy']);
    // Brand
    Route::get('brands', [AdminBrandController::class, 'index']);
    Route::get('brands/create', [AdminBrandController::class, 'create']);
    Route::post('brands', [AdminBrandController::class, 'store']);
    Route::get('brands/{id}/edit', [AdminBrandController::class, 'edit']);
    Route::put('brands/{id}', [AdminBrandController::class, 'edit']);
    Route::get('brands/{id}', [AdminBrandController::class, 'show']);
    Route::delete('brands/{id}', [AdminBrandController::class, 'destroy']);
    // Category
    Route::get('categories', [AdminCategoryController::class, 'index']);
    Route::get('categories/create', [AdminaCtegoryController::class, 'create']);
    Route::post('categories', [AdminCategoryController::class, 'store']);
    Route::get('categories/{id}/edit', [AdminCategoryController::class, 'edit']);
    Route::put('categories/{id}', [AdminCategoryController::class, 'edit']);
    Route::get('categories/{id}', [AdminCategoryController::class, 'show']);
    Route::delete('categories/{id}', [AdminCategoryController::class, 'destroy']);
    // orders
    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/create', [AdminOrderController::class, 'create']);
    Route::post('orders', [AdminOrderController::class, 'store']);
    Route::get('orders/{id}/edit', [AdminOrderController::class, 'edit']);
    Route::put('orders/{id}', [AdminOrderController::class, 'edit']);
    Route::get('orders/search', [AdminOrderController::class, 'search']);
    Route::get('orders/{id}', [AdminOrderController::class, 'show']);
    Route::delete('orders/{id}', [AdminOrderController::class, 'destroy']);
    Route::patch('orders/{id}/update-status', [AdminOrderController::class, 'updateStatus']);
});

 












