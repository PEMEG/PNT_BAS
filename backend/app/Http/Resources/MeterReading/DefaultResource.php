<?php

namespace App\Http\Resources\MeterReading;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Room\SimpleResource as SimpleRoomResource;

class DefaultResource extends JsonResource
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
            'room' => new SimpleRoomResource($this->room),
            'state' => $this->state
        ];
    }
}
