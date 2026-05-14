<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
