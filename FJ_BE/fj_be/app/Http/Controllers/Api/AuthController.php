<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Http\JsonResponse;
use Laravel\Socialite\Contracts\User as SocialiteUser;
    use Illuminate\Http\Request;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Hash;
    use Illuminate\Support\Facades\Validator;
    
    class AuthController extends Controller
    {
        /**
         * Create User
         * @param Request $request
         * @return User 
         */
        public function createUser(Request $request)
        {
            try {
                //Validated
                $validateUser = Validator::make($request->all(), 
                [
                    'name' => 'required',
                    'email' => 'required|email|unique:users,email',
                    'password' => 'required'
                ],[
                    'email.unique' => 'Địa chỉ email đã được sử dụng.',
                ]); 

                if ($validateUser->fails()) {
                    return response()->json(['message' => 'Validation failed', 'data' => $validateUser->errors()], 422);
                }

                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password)
                ]);

                
                $token = $user->createToken('AppName')->plainTextToken;

                return response()->json([
                    'message' => 'Đăng kí thành công',
                    'data' => [
                        'access_token' => $token,
                        'expires' => '7d',
                        'user' => [
                            '_id' => $user->id,
                            'email' => $user->email,
                            'roles' => $user->roles,
                            'name' => $user->name,
                            'createdAt' => $user->created_at,
                            'updatedAt' => $user->updated_at,
                        ],
                    ],
                ], 200);

            } catch (\Throwable $th) {
                return response()->json([
                    'status' => false,
                    'message' => $th->getMessage()
                ], 500);
            }
        }

        /**
         * Login The User
         * @param Request $request
         * @return User
         */
        public function loginUser(Request $request)
        {
            try {
                $validateUser = Validator::make($request->all(), 
                [
                    'email' => 'required|email',
                    'password' => 'required'
                ]);

                if($validateUser->fails()){
                    return response()->json([
                        'status' => false,
                        'message' => 'validation error',
                        'errors' => $validateUser->errors()
                    ], 401);
                }

                    // Thử đăng nhập người dùng
                $credentials = $request->only('email', 'password');

                if (Auth::attempt($credentials)) {
                    // Kiểm tra xem mật khẩu được cung cấp trong yêu cầu có khớp với mật khẩu của người dùng hay không
                    $user = auth()->user();
                    if (password_verify($request->password, $user->password)) {
                        // Tạo token cho người dùng đã xác thực
                        $token = $user->createToken('AppName')->plainTextToken;

                        // Trả về phản hồi thành công với dữ liệu người dùng và token
                        return response()->json([
                            'message' => 'Đăng nhập thành công',
                            'data' => [
                                'access_token' => $token,
                                'expires' => '7d',
                                'user' => [
                                    'id' => $user->id,
                                    'email' => $user->email,
                                    'roles' => $user->roles,
                                    'name' => $user->name,
                                    'createdAt' => $user->created_at,
                                    'updatedAt' => $user->updated_at,
                                ],
                            ],
                        ], 200);
                        
                    }
                }

                
                $Error['password'] = 'Thông tin đăng nhập không hợp lệ';
                return response()->json(['data' => $Error], 401);

            } catch (\Throwable $th) {
                return response()->json([
                    'status' => false,
                    'message' => $th->getMessage()
                ], 500);
            }
        }

        public function redirectToAuth(): JsonResponse
    {
        return response()->json([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
        ]);
    }

    public function handleAuthCallback(): JsonResponse
    {
        try {
            /** @var SocialiteUser $socialiteUser */
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        /** @var User $user */
        $user = User::query()
            ->firstOrCreate(
                [
                    'email' => $socialiteUser->getEmail(),
                ],
                [
                    'name' => $socialiteUser->getName(),
                    'google_id' => $socialiteUser->getId(),
                    'avatar' => $socialiteUser->getAvatar(),
                ]
            );

        return response()->json([
            'user' => $user,
            'access_token' => $user->createToken('google-token')->plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }
        public function logout()
        {
            auth()->user()->tokens()->delete();
                    return response()->json(['message' => 'Đăng xuất thành công'], 200);
            
        }
    }
