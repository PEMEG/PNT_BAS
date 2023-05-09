<?php

namespace App\Http\Resources\MeterReading;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SimpleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'month' => $this->month->format('Y-m-d'),
            'state' => $this->state
        ];
    }
}
