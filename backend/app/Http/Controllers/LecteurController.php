<?php

namespace App\Http\Controllers;

use App\Helpers\PasswordHelpers;
use App\Mail\LecteurCreate;
use App\Models\Lecteur;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class LecteurController extends Controller
{
    public function index()
    {
        $query = Lecteur::query()->orderBy('created_at', 'desc');
        $lecteurs = $query->get()->map(fn($lecteur) => [
            'id' => $lecteur->id,
            'idEncrypt' => encrypt($lecteur->id),
            'name' => $lecteur->user->name,
            'email' => $lecteur->user->email
        ]);

        return response()->json(['lecteurs' => $lecteurs]);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email|max:255',
        ]);
        $password = PasswordHelpers::generatePassword();

        try {
            $lect = DB::transaction(function () use ($request, $password) {
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($password),
                ]);

                $lect = Lecteur::create([
                    'user_id' => $user->id
                ]);
                $user->assignRole("Lecteur");
                return $lect;
            });

            // envoie du mail 
            try {
                Mail::to($request->email)->send(
                    new LecteurCreate($request->name, $request->email, $password)
                );
            } catch (Exception $th) {
                Log::info($th->getMessage());
                return response()->json([
                    'status' => 0,
                    'message' => "Une erreur est survenue lors de l\'envoie du mail",
                ]);
            }
            $lecteur = [
                'id' => $lect->id,
                'idEncrypt' => encrypt($lect->id),
                'name' => $lect->user->name,
                'email' => $lect->user->email
            ];
            return response()->json(
                [
                    'status' => 1,
                    'lecteur' => $lecteur,
                    'message' => 'Nouveau lecteur ajouté'
                ],
                201
            );
        } catch (Exception $th) {
            Log::info($th->getMessage());
            return response()->json([
                'status' => 0,
                'message' => 'Erreur est survenue lors de l\'ajout du lecteur,veuillez recommencer plustard!!'
            ]);
        }
    }
    public function edit($id)
    {
        $lecteur = Lecteur::findOrFail(decrypt($id));
        if (!$lecteur) {
            return response()->json([
                'status' => 0,
                'message' => "Pas de lecteur trouvé"
            ]);
        }
        $lect = [
            'id' => $lecteur->id,
            'idEncrypt' => encrypt($lecteur->id),
            'name' => $lecteur->user->name,
            'email' => $lecteur->user->email,
        ];
        return response()->json(['lecteur' => $lect]);
    }
    public function update(Request $request, $id)
    {
        $lecteur = Lecteur::find(decrypt($id));
        $user = User::find($lecteur->user->id);
        if (!$lecteur) {
            return response()->json([
                'status' => 0,
                'message' => 'Aucun lecteur trouvé'
            ]);
        }
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255'
        ]);
        try {
            DB::transaction(function () use ($request, $user, $lecteur) {
                $user->update([
                    'name' => $request->name,
                    'email' => $request->email
                ]);
            });
            return response()->json(
                [
                    'status' => 1,
                    'lecteur' => $lecteur,
                    'message' => 'Le lecteur est mis à jour !!'
                ]
            );
        } catch (Exception $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Une erreur est survenue lors de la mis à jour'
            ]);
        }
    }
    public function destroy($id)
    {
        $lecteur = Lecteur::findOrFail($id);
        $user = User::find($lecteur->user_id);
        if (!$lecteur) {
            return response()->json([
                'status' => 0,
                'message' => 'Aucun lecteur trouvé'
            ]);
        }
        try {
            $user->delete();
            return response()->json(
                [
                    'status' => 1,
                    'message' => 'Lecteur supprimé avec succès'
                ]
            );
        } catch (Exception $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Une erreur est survenue lors de la supression'
            ]);
            Log::info($th->getMessage());
        }
    }
}
