<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ExperienceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $this->validatedLimit($request);
        $experiences = Cache::remember('experiences.index', now()->addHour(), function () {
            return Experience::latest()->get()->toArray();
        });
        $experiences = $this->limitItems($experiences, $limit);

        return response()->json([
            'success' => true,
            'data' => $experiences
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string'
        ]);

        $experience = Experience::create($validated);

        return response()->json([
            'success' => true,
            'data' => $experience
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Experience $experience)
    {
        return response()->json([
            'success' => true,
            'data' => $experience
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'company' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string'
        ]);

        $experience->update($validated);

        return response()->json([
            'success' => true,
            'data' => $experience
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Experience $experience)
    {
        $experience->delete();

        return response()->json([
            'success' => true,
            'message' => 'Experience deleted successfully'
        ]);
    }
}
