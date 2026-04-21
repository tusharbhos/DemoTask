<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StateResource;
use App\Http\Resources\CityResource;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    /**
     * GET /api/locations
     * Returns all active states with their active cities.
     */
    public function index(): JsonResponse
    {
        $states = State::where('status', 'Active')
            ->with(['activeCities' => function ($query) {
                $query->select('id', 'state_id', 'city_name')->orderBy('city_name');
            }])
            ->select('id', 'state_name')
            ->orderBy('state_name')
            ->get();

        return response()->json([
            'success'      => true,
            'data'         => StateResource::collection($states),
            'total_states' => $states->count(),
            'generated_at' => now()->toISOString(),
        ]);
    }

    /**
     * GET /api/locations/states
     * Returns all active states (without cities).
     */
    public function statesOnly(): JsonResponse
    {
        $states = State::where('status', 'Active')
            ->select('id', 'state_name')
            ->orderBy('state_name')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $states->map(fn($s) => ['id' => $s->id, 'state_name' => $s->state_name]),
            'total'   => $states->count(),
        ]);
    }

    /**
     * GET /api/locations/states/{id}/cities
     * Returns all active cities for a specific active state.
     */
    public function citiesByState(int $stateId): JsonResponse
    {
        $state = State::where('id', $stateId)
            ->where('status', 'Active')
            ->select('id', 'state_name')
            ->first();

        if (!$state) {
            return response()->json([
                'success' => false,
                'message' => 'State not found or is inactive.',
            ], 404);
        }

        $cities = City::where('state_id', $stateId)
            ->where('status', 'Active')
            ->select('id', 'city_name')
            ->orderBy('city_name')
            ->get();

        return response()->json([
            'success'    => true,
            'state'      => $state->state_name,
            'state_id'   => $state->id,
            'data'       => CityResource::collection($cities),
            'total'      => $cities->count(),
        ]);
    }
}
