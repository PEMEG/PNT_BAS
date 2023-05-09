<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeterReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'state',
        'month',
        'room_id',
        'unit_cost'
    ];

    protected $casts = [
        'month' => 'date:Y-m-d'
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
