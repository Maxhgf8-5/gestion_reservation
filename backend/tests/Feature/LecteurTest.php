<?php

namespace Tests\Feature;

use App\Models\Lecteur;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LecteurTest extends TestCase
{
    /**
     * A basic feature test example.
     */
     public function test_lister_lecture(): void
    {
        Lecteur::factory(1)->create();

        $response = $this->getJson('/api/lecteur');

        $response->assertStatus(200)->assertJsonCount(1);
    }
    public function test_creer_lecteur(){
        $response=$this->postJson('/api/lecteur/store',[
             'nom'=>'Lecteur1',
             'email'=>'lecteur@lecteur.com'
        ]);
        $response->assertStatus(201);
        $this->assertDatabaseHas('lecteurs',['nom'=>'Lecteur1']);
    }

}
