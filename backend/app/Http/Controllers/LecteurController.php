<?php

namespace App\Http\Controllers;

use App\Models\Lecteur;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LecteurController extends Controller
{
    public function index()
    {
        $query = Lecteur::query()->orderBy('created_at', 'desc');
        $lecteurs = $query->get()->map(fn($lecteur) => [
            'id' => $lecteur->id,
            'idEncrypted' => encrypt($lecteur->id),
            'nom' => $lecteur->nom,
            'email' => $lecteur->email,
        ]);

        return response()->json(['lecteurs' => $lecteurs]);
    }
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:lecteurs,email|max:255|unique:lecteurs',
        ]);
        try {
            $lecteur = Lecteur::create($validatedData);
            return response()->json(['lecteur' => $lecteur, 'message' => 'Nouveau lecteur ajouté'], 201);
        } catch (Exception $th) {
            Log::info($th->getMessage());
        }
    }
    public function edit($id)
    {
        $lecteur = Lecteur::findOrFail(decrypt($id));
        return response()->json(['lecteur' => $lecteur]);
    }
    public function update(Request $request, $id)
    {
        Log::info("lecteur update");
        $lecteur = Lecteur::findOrFail(decrypt($id));

        $validatedData = $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:lecteurs,email,' . $lecteur->id,
        ]);
        try {
            $lecteur->update($validatedData);
            return response()->json(['lecteur' => $lecteur, 'message' => 'Le lecteur est mis à jour !!']);
        } catch (Exception $th) {
            Log::info($th->getMessage());
        }
    }
    public function destroy($id)
    {
        Log::info("Attempting to delete lecteur with id: $id");
        $lecteur = Lecteur::findOrFail($id);
        try {
            $lecteur->delete();
            return response()->json(['message' => 'Lecteur supprimé avec succès']);
        } catch (Exception $th) {
            Log::info($th->getMessage());
        }
    }
}
