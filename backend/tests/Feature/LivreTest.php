<?php

namespace Tests\Feature;

use App\Models\Livre;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LivreTest extends TestCase
{
    /**
     * A basic feature test example.
     */
     use RefreshDatabase;

    public function test_lister_livre(): void
    {
        Livre::factory(1)->create();

        $response = $this->getJson('/api/livre');

        $response->assertStatus(200)->assertJsonCount(1);
    }
    public function test_creer_livre(){
        $response=$this->postJson('/api/livre/store',[
            'titre'=>'Sous l\'orage',
            'auteur'=>'Seydou Badian',
            'annee_publication'=>'1997',
            'is_reserved'=>true
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('livres',['titre'=>'Sous l\'orage']);
    }
}
