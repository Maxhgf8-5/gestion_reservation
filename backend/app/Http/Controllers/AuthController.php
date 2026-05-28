<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(AuthRequest $request)
    {

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['status' => 0, 'message' => 'Identifiants Invalides'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 1,
            'token' => $token,
            'roles' => $user->getRoleNames(),
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    // le user connecter , on le retourne 
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
    public function logout(Request $request)
    {
        Log::info("dans le logout");
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 1,
            'message' => 'Logged out'
        ]);
    }
}
