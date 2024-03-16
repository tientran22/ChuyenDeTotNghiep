<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ProductController extends Controller
{
    public function getProducts(Request $request)
    {
        // Lấy tham số từ request hoặc sử dụng giá trị mặc định
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 4);

        // Lấy tổng số sản phẩm
        // $totalProducts = Product::count();

        // Tính tổng số trang
        // $totalPages = ceil($totalProducts / $limit);

        $sortBy = $request->input('sort_by', 'createdAt');
        $sortOrder = $request->input('order', 'desc');
        // Kiểm tra nếu thứ tự sắp xếp không hợp lệ, sử dụng mặc định là 'asc'
        if (!in_array($sortOrder, ['asc', 'desc'])) {
            $sortOrder = 'desc';
        }

        // Kiểm tra xem trường sắp xếp có hợp lệ không
        $validSortColumns = ['price', 'view', 'sold', 'created_at'];
        if (!in_array($sortBy, $validSortColumns)) {
            $sortBy = 'created_at'; // Sắp xếp theo created_at nếu không hợp lệ
        }

        // Lọc theo giá tối thiểu và tối đa
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');

        

        // Bắt đầu với một truy vấn để lấy tất cả sản phẩm
        $query = Product::query();

        if ($minPrice !== null) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice !== null) {
            $query->where('price', '<=', $maxPrice);
        }
        // Kiểm tra xem người dùng có chọn lọc theo danh mục không

   // Lấy tham số từ request
   $category = $request->input('category');


       
   if ($category) {
    // Nếu người dùng đã chọn lọc theo category
    $query->where('category_id', $category);
    }

   // Lấy tham số từ request
    $brand = $request->input('brand');

    if ($brand) {
    // Nếu người dùng đã chọn lọc theo brand
        $query->where('brand_id', $brand);
        }
    // Tìm kiếm sản phẩm dựa trên từ khóa
    $keyword = $request->input('name');
    if ($keyword) {
        $query->where('name', 'like', '%' . $keyword . '%');
    }

    // Đếm số lượng sản phẩm sau khi lọc
    $totalProducts = $query->count();
    $totalPages = ceil($totalProducts/$limit);
    
    $products = $query->orderBy($sortBy, $sortOrder)
          ->paginate($limit, ['*'], 'page', $page);

          
        return response()->json([
            'message' => 'Lấy các sản phẩm thành công',
            'data' => [
                'products' => $products->items(),
                'pagination' => [
                    'page' => $products->currentPage(),
                    'limit' => $limit,
                    'page_size' => $totalPages,
                    'total_items' => $totalProducts, // Tổng số sản phẩm sau khi lọc
                ],
            ],
        ]);
    }

    public function getProductDetail($id)
    {
        // Lấy thông tin của sản phẩm cụ thể
        $product = Product::find($id);
    
        // Kiểm tra xem sản phẩm có tồn tại không
        if (!$product) {
            return response()->json(['error' => 'Product not found.'], 404);
        }
    
        // Lấy danh sách các category của sản phẩm
        $categories = $product->category()->pluck('id');
    
        // Tìm các sản phẩm tương tự dựa trên category của sản phẩm hiện tại
        $similarProducts = Product::whereHas('category', function($query) use ($categories) {
            $query->whereIn('id', $categories);
        })->where('id', '!=', $id)->take(6)->get();
    
        // Trả về thông tin chi tiết của sản phẩm cùng với danh sách các sản phẩm tương tự
        return response()->json([
            'message' => 'Product detail and similar products fetched successfully.',
            'product' => $product,
            'similar_products' => $similarProducts,
        ], 200);
    }


}

