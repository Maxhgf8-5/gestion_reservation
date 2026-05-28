<?php

namespace App\Http\Controllers;

use App\Models\Auteur;
use App\Models\Livre;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LivreController extends Controller
{

    public function getLivre()
    {
        $livres = Livre::all();
        return response()->json([
            'livres' => $livres
        ]);
    }
    // function d'affichage de ts les livres 
    public function index(Request $request)
    {
        // les variable de recherch 
        $search = $request->query('search');
        $annee = $request->query('annee');
        Log::info("LivreController index called with search: $search and date_publication: " . $request->query('date_publication'));
        $livreAll = Livre::query();
        $livreActif = Livre::where('is_reserved', false)->count();
        // l'ensemble des livres 


        $query = Livre::query()
            ->when($annee, function ($q) use ($annee) {
                $q->where('annee_publication', $annee);
            })
            ->when($search, function ($q) use ($search) {
                $searchLower = strtolower($search);

                $q->where(function ($sub) use ($searchLower) {
                    $sub->whereRaw('LOWER(titre) LIKE ?', ["%{$searchLower}%"])
                        ->orWhereRaw('LOWER(auteur) LIKE ?', ["%{$searchLower}%"]);
                });
            })
            ->orderBy('created_at', 'desc');

        $livres = $query->paginate($request->input('per_page', 4))
            ->through(function ($livre) {
                return [
                    'id' => $livre->id,
                    'idEncrypted' => encrypt($livre->id),
                    'titre' => $livre->titre,
                    'auteur' => $livre->auteur,
                    'annee_publication' => $livre->annee_publication,
                    'is_reserved' => $livre->is_reserved
                ];
            });
        return response()->json([
            'livreAll' => $livreAll->get(),
            'livres' => $livres,
            'livreActif' => $livreActif
        ], 200);
    }
    // function d'ajout d'1 loivre 
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titre' => 'required|string|max:255',
            'auteur' => 'required',
            'annee_publication' => 'required|integer',
        ]);
        $livreAll = Livre::all();
        $livreActif = Livre::where('is_reserved', false)->count();
        $validatedData['is_reserved'] = false;

        try {
            $livre = Livre::create($validatedData);
            $liv = [
                'id' => $livre->id,
                'idEncrypted' => encrypt($livre->id),
                'titre' => $livre->titre,
                'auteur' => $livre->auteur,
                'annee_publication' => $livre->annee_publication,
                'is_reserved' => $livre->is_reserved
            ];
            return response()->json([
                'status' => 1,
                'livreAll' => $livreAll,
                'livreActif' => $livreActif,
                'livre' => $liv,
                'message' => 'Nouveau livre ajouté'
            ], 201);
        } catch (Exception $th) {

            Log::info($th->getMessage());
            return response()->json([
                'status' => 1,
                'message' => 'Une erreur est survenue lors de l\'ajout du livre'
            ]);
        }
    }

    // function de recherche , lelement a editer 
    public function edit($id)
    {
        $livre = Livre::find(decrypt($id));
        if (!$livre) {
            return response()->json([
                'status' => 0,
                'message' => 'Livre introuvale'
            ]);
        }
        return response()->json([
            'livre' => $livre
        ]);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'titre' => 'required|string|max:255',
            'auteur' => 'required',
            'annee_publication' => 'required|string',
        ]);
        $livre = Livre::findOrFail(decrypt($id));

        try {
            $livre->update($validatedData);
            $l = [
                'id' => $livre->id,
                'idEncrypted' => encrypt($livre->id),
                'titre' => $livre->titre,
                'auteur' => $livre->auteur,
                'annee_publication' => $livre->annee_publication
            ];
            return response()->json([
                'status' => 1,
                'livre' => $l,
                'message' => 'Livre mis à jour!!'
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'status' => 1,
                'message' => 'Une erreur est survenue lors de la mis à jour !!'
            ]);
            Log::info($th->getMessage());
        }
    }



    public function destroy($id)
    {
        $livre = Livre::find($id);
        if (!$livre) {
            return response()->json([
                'status' => 0,
                'message' => 'Livre introuvable'
            ]);
        }
        try {
            $livre->delete();
            return response()->json([
                'status' => 1,
                'message' => 'Livre supprimé avec succès.'
            ], 200);
        } catch (Exception $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Une erreur est survenue lors de la supression du livre!'
            ]);
            Log::info($th->getMessage());
        }
    }
}
