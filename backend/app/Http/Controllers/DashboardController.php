<?php

namespace App\Http\Controllers;

use App\Models\Livre;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function index()
    {
        Log::info("je suis dans le dashboard");
        // livre disponible, livre réservé, nombre de lecteurs, nombre de réservations
        $livresDisponibles = Livre::where('is_reserved', false)->count();
        $livresReserves = Livre::where('is_reserved', true)->count();
        //    le nombre de reservation par lecteur
        $reservationLecteur =  Reservation::where('etat',true)->select('lecteur_id', DB::raw('count(*) as total'))
            ->groupBy('lecteur_id')
            ->get();
        return response()->json([
            'livresDisponibles' => $livresDisponibles,
            'livresReserves' => $livresReserves,
            'reservationLecteur' => $reservationLecteur->load(['lecteur','livre'])
        ]);
    }
}
