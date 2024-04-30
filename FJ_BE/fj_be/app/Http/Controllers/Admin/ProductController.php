<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // Hiển thị tất cả sản phẩm dưới dạng JSON
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 4);
        
        $query = Product::query();
        // Tìm kiếm sản phẩm dựa trên từ khóa
       // Áp dụng điều kiện lọc theo giá tối thiểu
       $minPrice = $request->input('min_price'); // Lấy giá tối thiểu từ request
    $maxPrice = $request->input('max_price'); // Lấy giá tối đa từ request
    if ($minPrice !== null) {
        $query->where('price', '>=', $minPrice);
    }

    // Áp dụng điều kiện lọc theo giá tối đa
    if ($maxPrice !== null) {
        $query->where('price', '<=', $maxPrice);
    }
        $totalProducts = $query->count();
        $totalPages = ceil($totalProducts/$limit);
        $products = $query->paginate($limit, ['*'], 'page', $page);
        return response()->json([
            'message' => 'Lấy tất cả sản phẩm thành công',
            'data' => [
                'products' => $products->items(),
                'pagination' => [
                    'page' => $products->currentPage(),
                    'limit' => $limit,
                    'page_size' => $totalPages,
                    'total_items' => $totalProducts, // Tổng số sản phẩm sau khi lọc
                ],
            ]
        ]);
    }

    public function store(Request $request)
    {
        // Kiểm tra hợp lệ dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'price_before_discount' => 'required|numeric|min:0',
            'brand_id' => 'required|exists:brands,id',
            'category_id' => 'required|exists:categories,id',   
            'description' => 'nullable|string',
            'image' => 'required|string'
            // Thêm các quy tắc kiểm tra hợp lệ cho các trường khác nếu cần thiết
        ]);

        // Nếu dữ liệu không hợp lệ, trả về lỗi
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Tạo sản phẩm mới
        $product = Product::create([
            'name' => $request->name,
            'quantity' => $request->quantity,
            'price' => $request->price,
            'price_before_discount' => $request->price_before_discount,
            'brand_id' => $request->brand_id,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'image' => $request->image
            // Thêm các trường khác nếu cần thiết
        ]);

        return response()->json(['message' => 'Thêm sản phẩm vào thành công',
        'data' => $product,], 201);
    }

    public function edit(Request $request, $id)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'price_before_discount' => 'required|numeric|min:0',
            'brand_id' => 'required|exists:brands,id',
            'category_id' => 'required|exists:categories,id',   
            'description' => 'nullable|string',
            'image' => 'required|string'
            // Add other validation rules for other fields
        ]);

        // Find the product by ID
        $product = Product::findOrFail($id);

        // Update product data
        $product->update($request->all());

        // Return a response
        return response()->json(['message' => 'Sửa sản phẩm vào thành công',
        'data' => $product,], 201);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id); // Tìm sản phẩm theo ID

        return response()->json(['message' => 'Lấy thông tin chi tiết sản phẩm thành công',
        'data' => $product,], 201); // Trả về JSON chứa thông tin của sản phẩm
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();

        return response()->json(['message' => 'Xóa sản phẩm thành công']);
    }

    public function search(Request $request)
{
    $searchKeyword = $request->query('search');
    $categoryFilter = $request->query('category'); // Lấy category từ request
    $brandFilter = $request->query('brand'); // Lấy category từ request

    $page = $request->input('page', 1);
        $limit = $request->input('limit', 8);
    $query = Product::query();

    // Áp dụng điều kiện tìm kiếm
    if ($searchKeyword) {
        $query->where('name', 'like', '%' . $searchKeyword . '%');
    }

    // Áp dụng điều kiện lọc theo category
    if ($categoryFilter) {
        // Kiểm tra xem $categoryFilter có phải là mảng không
        if (is_array($categoryFilter)) {
            $query->whereIn('category_id', $categoryFilter);
        } else {
            // Nếu không phải là mảng, sử dụng phương thức where()
            $query->where('category_id', $categoryFilter);
        }
    }

    // Áp dụng điều kiện lọc theo category
    if ($brandFilter) {
        // Kiểm tra xem $brandFilter có phải là mảng không
        if (is_array($brandFilter)) {
            $query->whereIn('brand_id', $brandFilter);
        } else {
            // Nếu không phải là mảng, sử dụng phương thức where()
            $query->where('brand_id', $brandFilter);
        }
    }

    
    
    $totalProducts = $query->count();
    $totalPages = ceil($totalProducts/$limit);
    $products = $query->paginate($limit, ['*'], 'page', $page);
    // Lấy kết quả

    return response()->json(['data' => [
        'products' => $products->items(),
        'pagination' => [
            'page' => $products->currentPage(),
            'limit' => $limit,
            'page_size' => $totalPages,
            'total_items' => $totalProducts, // Tổng số sản phẩm sau khi lọc
        ],
    ]]);
}

}

