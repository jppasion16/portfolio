<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Skill extends Model
{
    protected $fillable = [
        'name',
        'category',
        'level',
        'order',
        'color'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('skills.index');
        });

        static::deleted(function () {
            Cache::forget('skills.index');
        });
    }
}
