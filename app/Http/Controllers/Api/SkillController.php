<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SkillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $this->validatedLimit($request);
        $skill = Cache::remember('skills.index', now()->addHour(), function () {
            return Skill::orderBy('order')->get()->toArray();
        });
        $skill = $this->limitItems($skill, $limit);

        return response()->json([
            'success' => true,
            'data' => $skill
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'level' => 'required|integer|min:0|max:100',
            'order' => 'nullable|integer',
            'color' => 'nullable|string'
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'success' => true,
            'data' => $skill
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Skill $skill)
    {
        return response()->json([
            'success' => true,
            'data' => $skill
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'level' => 'sometimes|required|integer|min:0|max:100',
            'order' => 'nullable|integer',
            'color' => 'nullable|string'
        ]);

        $skill->update($validated);

        return response()->json([
            'success' => true,
            'data' => $skill
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Skill $skill)
    {
        $skill->delete();

        return response()->json([
            'success' => true,
            'message' => 'Skill deleted successfully'
        ]);
    }
}
