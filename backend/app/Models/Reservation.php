<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'lecteur_id',
        'livre_id',
        'date_reservation',
        'etat',
    ];

    public function lecteur()
    {
        return $this->belongsTo(Lecteur::class);
    }
    public function livre()
    {
        return $this->belongsTo(Livre::class);
    }
}
