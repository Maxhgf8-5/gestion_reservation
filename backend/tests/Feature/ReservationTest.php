<?php

namespace Tests\Feature;

use App\Models\Lecteur;
use App\Models\Livre;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ReservationTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;
    public function test_creer_reservation(): void
    {
        $livre = Livre::factory()->create();
        $lecteur = Lecteur::factory()->create();
        $response = $this->postJson('/api/reservation/store', [
            'livre_id' => $livre->id,
            'lecteur_id' => $lecteur->id,
            'date_reservation' => '2026-06-14',
        ]);
        $response->assertStatus(201);
        $response = $this->assertDatabaseHas('reservations', [
            'livre_id' => $livre->id,
            'lecteur_id' => $lecteur->id
        ]);
    }

    public function test_impossible_de_rserver_un_livre_deux_foi()
    {
        $livre = Livre::factory()->create(['is_reserved' => true]);
        $lecteur = Lecteur::factory()->create();
        $response = $this->postJson('/api/reservation/store', [
            'livre_id' => $livre->id,
            'lecteur_id' => $lecteur->id,
            'date_reservation' => '2026-06-14',
        ]);
        $response->assertStatus(422)
            ->assertJsonFragment(['livre_id' => ["Ce livre est déjà réservé."]]);

        $this->assertDatabaseCount('reservations', 0);
    }
    public function test_de_reserver_un_livre()
    {
        $livre = Livre::factory()->create(['is_reserved' => false]);
        $lecteur = Lecteur::factory()->create();
        $response = $this->postJson('/api/reservation/store', [
            'livre_id' => $livre->id,
            'lecteur_id' => $lecteur->id,
            'date_reservation' => '2026-06-14',
        ]);
        $response->assertStatus(201)
            ->assertJsonFragment(['message' => 'Réservation créée avec succès.']);

        $this->assertDatabaseCount('reservations', 1);
    }
}
