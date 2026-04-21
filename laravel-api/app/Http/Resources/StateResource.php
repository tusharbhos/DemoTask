<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'state_name' => $this->state_name,
            'cities'     => CityResource::collection($this->whenLoaded('activeCities')),
        ];
    }
}
