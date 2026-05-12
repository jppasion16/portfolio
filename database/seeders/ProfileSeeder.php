<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Profile;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Profile::create([
            'name' => 'John Paul Pasion',
            'title' => 'Full Stack Developer',
            'bio' => 'I build scalable and performant web applications with clean code and good user experience. I enjoy turning ideas into real products.',
            'location' => 'Philippines',
            'email' => 'jp.pasion16@gmail.com',
            'github' => 'github.com/jppasion16',
            'linkedin' => 'linkedin.com/in/john-paul-pasion-8299ba137',
            'is_available' => true
        ]);
    }
}
