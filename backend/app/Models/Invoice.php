<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'month',
        'consumption',
        'cost'
    ];

    protected $casts = [
        'month' => 'date:Y-m-d'
    ];

    public function scopeMonth($query, $month)
    {
        return $query->where('month', $month);
    }
}
