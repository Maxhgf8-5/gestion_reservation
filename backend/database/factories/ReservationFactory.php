<?php

namespace Database\Factories;

use App\Models\Lecteur;
use App\Models\Livre;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'livre_id'=>Livre::factory(),
            'lecteur_id'=>Lecteur::factory(),
            'date_reservation'=>fake()->dateTimeBetween('now','+30 days')
        ];
    }
}
