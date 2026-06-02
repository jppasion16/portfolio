<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class Controller
{
    protected function validatedLimit(Request $request): ?int
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1',
        ]);

        return isset($validated['limit']) ? (int) $validated['limit'] : null;
    }

    protected function limitItems(array $items, ?int $limit): array
    {
        return $limit ? array_slice($items, 0, $limit) : $items;
    }
}
