<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['name', 'phone_number','total_amount', 'delivery_address', 'status', 'note'];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
