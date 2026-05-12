<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::create([
            'code' => 'web-development',
            'name' => 'Web Development',
            'description' => 'Building responsive and performant web applications using modern technologies.',
            'icon' => 'fa-solid fa-code'
        ]);
    }
}
