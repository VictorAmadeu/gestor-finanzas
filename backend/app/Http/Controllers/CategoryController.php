<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * Devuelve todas las categorías como JSON.
     */
    public function index()
    {
        return response()->json(Category::all());
    }
}