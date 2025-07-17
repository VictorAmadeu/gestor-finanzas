<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        Category::insert([
            ['nombre' => 'Salario'],
            ['nombre' => 'Alquiler'],
            ['nombre' => 'Comida'],
            ['nombre' => 'Transporte'],
            ['nombre' => 'Educación'],
            ['nombre' => 'Ocio'],
            ['nombre' => 'Otros']
        ]);
    }
}