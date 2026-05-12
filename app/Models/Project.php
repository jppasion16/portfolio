<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'stack',
        'repo_url',
        'live_url',
        'is_featured'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    protected static function booted()
    {
        static::saved(function () {
            Cache::forget('projects.index');
        });

        static::deleted(function () {
            Cache::forget('projects.index');
        });
    }
}
