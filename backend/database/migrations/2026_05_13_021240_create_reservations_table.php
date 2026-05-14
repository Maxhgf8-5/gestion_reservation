<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lecteur_id');
            $table->foreign('lecteur_id')->references('id')->on('lecteurs')->onDelete('cascade');
            $table->unsignedBigInteger('livre_id');
            $table->foreign('livre_id')->references('id')->on('livres')->
                onDelete('cascade');
            $table->date('date_reservation'); 
            $table->boolean('etat')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
