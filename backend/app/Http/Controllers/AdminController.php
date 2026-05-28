<?php

namespace App\Http\Controllers;

use App\Helpers\PasswordHelpers;
use App\Mail\AdminCreate;
use App\Models\Admin;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    public function index(Request $request)
    {

        $roles = Role::all();
        $adminAll = Admin::all();
        $query = Admin::query()->orderBy('created_at', 'desc');
        $admins = $query->paginate($request->input('per_page', 5))->through(function ($a) {
            return [
                'id' => $a->id,
                'idEdit' => encrypt($a->id),
                'name' => $a->user->name,
                'email' => $a->user->email,
                'telephone' => $a->telephone
            ];
        });

        return response()->json([
            'adminAll' => $adminAll,
            'admins' => $admins,
            'roles' => $roles,
        ],200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email|max:255',
            'telephone'  => 'required|string|max:255',
        ]);

        $adminAll = Admin::all();
        $password = PasswordHelpers::generatePassword();
        try {

            $admin = DB::transaction(function () use ($request, $password) {

                try {
                    $user = User::create([
                        'name'      => $request->name,
                        'email'      => $request->email,
                        'password'    => Hash::make($password),
                    ]);
                    $admin = Admin::create([
                        'telephone'    => $request->telephone,
                        'user_id' => $user->id,
                    ]);
                    $user->assignRole("Admin");

                    return $admin;
                } catch (Exception $th) {
                    Log::info($th->getMessage());

                    return response()->json([
                        'status' => 0,
                        'message' => 'Erreur de creation,veuillez recommencer plustard'
                    ]);
                }
            });

            // envoie du mail 
            try {
                Mail::to($request->email)->send(
                new AdminCreate($request->name, $request->email, $password)
            );
            } catch (Exception $th) { 
                return response()->json([
                    'status'=>0,
                    'message'=>"Une erreur est survenue lors de l\'envoie du mail",
                ]);
            }
            
            $newAdmin = [
                'id'         => $admin->id,
                'name'       => $admin->user->name,
                'email'      => $admin->user->email,
                'telephone' => $admin->telephone,

            ];
            return response()->json([
                'message'   => 'Nouveau article enregistré',
                'status'    => 1,
                'adminAll' => $adminAll,
                'admin' => $newAdmin,
            ], 201);
        } catch (Exception $th) {
            Log::info($th->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Erreur de chargement,veuilez recommencer plustard'
            ]);
        }
    }
}
