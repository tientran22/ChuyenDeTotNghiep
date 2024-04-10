<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function store(Request $request)
{
    // Validate request data
    $validatedData = $request->validate([
        'name' => 'required',
        'phone_number' =>'required',
        'total_amount' => 'required',
        'delivery_address' => 'required',
        'note' => 'nullable',
        'items' => 'required|array',
        'items.*.product_id' => 'required',
        'items.*.quantity' => 'required',
        'items.*.price' => 'required', 
    ]);

    try {
        // Create new order
        $order = Order::create($validatedData);

        // Save order items
        $order->items()->createMany($validatedData['items']);

        // Return success response
        return response()->json(['message' => 'Đặt hàng thành công', 'order' => $order], 201);
    } catch (\Exception $e) {
        // Return error response
        return response()->json(['message' => 'Có lỗi xảy ra khi đặt hàng', 'error' => $e->getMessage()], 500);
    }
}

}
