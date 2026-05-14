<?php

namespace App\Http\Controllers;

use App\Models\Livre;
use App\Models\Reservation;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservationController extends Controller
{
    public function index()
    {
        $query = Reservation::query()->orderBy('created_at', 'desc');
        $reservations = $query->get()->map(fn($r) => [
            'id' => $r->id,
            'livre' => $r->livre->titre,
            'idEncrypted' => encrypt($r->id),
            'lecteur' => $r->lecteur->nom,
            'date_reservation' => $r->date_reservation,
            'etat' => $r->etat,
        ]);
        return response()->json([
            'reservations' => $reservations,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'lecteur_id' => 'required|exists:lecteurs,id',
            'livre_id' => 'required|exists:livres,id',
            'date_reservation' => 'required|date',
        ]);
        // verifier si le livre est déjà réservé
        $livre = Livre::findOrFail($validatedData['livre_id']);
        if ($livre->is_reserved) {
            Log::info('le livre est deja reserve');
            return response()->json([
                'errors' => ['livre_id' => ['Ce livre est déjà réservé.'],]

            ], 422);
        }
        try {
            $reservation = DB::transaction(function () use ($validatedData, $livre) {
                $reservation = Reservation::create($validatedData);
                // mettre le livre comme réservé
                $livre->update(['is_reserved' => true]);
                return $reservation;
            });

            return response()->json([
                'reservation' => $reservation,
                'message' => 'Réservation créée avec succès.'
            ], 201);
        } catch (Exception $th) {
            Log::info($th->getMessage());
        }
    }

    public function annuler($id)
    {
        try {
            $reservation = Reservation::findOrFail($id);
            DB::transaction(function () use ($reservation) {
                $reservation->update(['etat' => false]);
                // remttre le livre comme disponible
                $livre = Livre::findOrFail($reservation->livre_id);
                $livre->update(['is_reserved' => false]);
            });
            return response()->json(['message' => 'Réservation annulée avec succès.'], 200);
        } catch (Exception $th) {
            Log::info($th->getMessage());
            return response()->json(['error' => 'Une erreur est survenue lors de l\'annulation de la réservation.'], 500);
        }
    }

    public function edit($id)
    {
        $reservation = Reservation::findOrFail(decrypt($id));
        return response()->json([
            'reservation' => $reservation
        ]);
    }
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'lecteur_id' => 'required|exists:lecteurs,id',
            'livre_id' => 'required|exists:livres,id',
            'date_reservation' => 'required|date',
        ]);
        $livre = Livre::findOrFail($validatedData['livre_id']);
        if ($livre->is_reserved) {
            return response()->json(['error' => 'Ce livre est déjà réservé.'], 422);
        }
        $reservation = Reservation::findOrFail(decrypt($id));
        DB::transaction(function () use ($reservation, $validatedData, $livre) {
            $reservation->update($validatedData);
            $livre->update(['is_reserved' => true]);
        });
        return response()->json(['reservation' => $reservation], 200);
    }

    public function destroy($id)
    {
        $reservation = Reservation::findOrFail($id);
        try {
            $reservation->delete();
            return response()->json(['message' => 'Réservation supprimée avec succès.'], 200);
        } catch (Exception $th) {
            Log::info($th->getMessage());
        }
    }
}
