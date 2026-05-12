<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SkillController;
use App\Http\Controllers\Api\ExperienceController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;

$apiArray = [
    'projects' => ProjectController::class,
    'services' => ServiceController::class,
    'skills' => SkillController::class,
    'experiences' => ExperienceController::class,
    'activity-logs' => ActivityLogController::class,
];

foreach ($apiArray as $name => $controller) {
    Route::hybridApiResource($name, $controller);
}

// Auth
Route::post('login', [AuthController::class, 'login']);

Route::get('profiles/{profile}', [ProfileController::class, 'show']);
Route::post('messages', [MessageController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::put('profiles/{profile}', [ProfileController::class, 'update']);
    Route::get('messages', [MessageController::class, 'index']);
    Route::get('messages/{message}', [MessageController::class, 'show']);
});
