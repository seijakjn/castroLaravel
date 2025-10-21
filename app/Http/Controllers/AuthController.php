<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function showRegister()
    {
        return view('auth.register');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $userData = [
                'firstName' => $user->first_name ?? $user->name,
                'lastName' => $user->last_name ?? '',
                'userType' => $user->user_type ?? 'student',
                'email' => $user->email
            ];

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $userData
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'The provided credentials do not match our records.'
        ], 401);
    }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'user_type' => 'required|in:student,employee',
                'phone' => 'nullable|string|max:20'
            ]);

            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'user_type' => $validated['user_type'],
                'phone' => $validated['phone'] ?? null,
                'is_active' => true,
            ]);

            Auth::login($user);

            $userData = [
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'userType' => $user->user_type,
                'email' => $user->email
            ];

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user' => $userData
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function logout()
    {
        Auth::logout();
        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }
}
