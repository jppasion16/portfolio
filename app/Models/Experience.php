<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Experience extends Model
{
    protected $fillable = [
        'company',
        'role',
        'start_date',
        'end_date',
        'description'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('experiences.index');
        });

        static::deleted(function () {
            Cache::forget('experiences.index');
        });
    }
}
