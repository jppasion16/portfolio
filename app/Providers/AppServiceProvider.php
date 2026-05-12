<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::macro('hybridApiResource', function ($name, $controller) {
            Route::apiResource($name, $controller)->only(['index', 'show']);
            Route::apiResource($name, $controller)->except(['index', 'show'])->middleware('auth:sanctum');
        });
    }
}
