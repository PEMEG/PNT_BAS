<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'company_id',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function meterReadings(): HasMany
    {
        return $this->hasMany(MeterReading::class);
    }

    public function scopeMeterReadingsDateRange($query, $start, $end)
    {
        return $query->with([
            'meterReadings' => function ($q) use ($start, $end) {
                $q
                    ->where('month', '>=', $start)
                    ->where('month', '<=', $end);
            }
        ]);
    }
}
