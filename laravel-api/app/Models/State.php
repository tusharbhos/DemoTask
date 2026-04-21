<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class State extends Model
{
    protected $fillable = ['state_name', 'status'];

    public function cities(): HasMany
    {
        return $this->hasMany(City::class);
    }

    public function activeCities(): HasMany
    {
        return $this->hasMany(City::class)->where('status', 'Active')->orderBy('city_name');
    }
}
