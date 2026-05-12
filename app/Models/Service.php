<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Service extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'icon',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('services.index');
        });

        static::deleted(function () {
            Cache::forget('services.index');
        });
    }
}
