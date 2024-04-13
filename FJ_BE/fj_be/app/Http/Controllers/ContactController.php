<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function sendEmail(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email_address' => 'required|email',
            'message' => 'required',
        ]);

        $data = [
            'name' => $request->name,
            'email_address' => $request->email_address,
            'message' => $request->message,
        ];

        Mail::send([], $data, function ($message) use ($data) {
            $message->to('tvt22kk@gmail.com', 'Fuji Fruit')
                    ->subject('Liên hệ người dùng')
                    ->html($data['message']);
            $message->from($data['email_address'], $data['name']);
        });
        

        

        return response()->json(['message' => 'Nội dung đã gửi thành công'],200);
    }
}
