<?php

namespace App\Http\Resources\Room;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Company\SimpleResource as SimpleCompanyResource;
use App\Http\Resources\MeterReading\SimpleResource as SimpleMeterReadingResource;

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
            'name' => $this->name,
            'company' => new SimpleCompanyResource($this->company),
            'meterReadings' => SimpleMeterReadingResource::collection($this->meterReadings)
        ];
    }
}
