<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Cache;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $limit = $this->validatedLimit($request);
        $services = Cache::remember('services.index', now()->addHour(), function () {
            return Service::get()->toArray();
        });
        $services = $this->limitItems($services, $limit);

        return response()->json([
            'success' => true,
            'data' => $services
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:255|unique:services,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'order' => 'nullable|integer'
        ]);

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'data' => $service
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'code' => 'sometimes|required|string|max:255|unique:services,code,' . $service->id,
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:255',
            'order' => 'nullable|integer'
        ]);

        $service->update($validated);

        return response()->json([
            'success' => true,
            'data' => $service
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully'
        ]);
    }
}
