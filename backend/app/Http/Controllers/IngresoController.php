<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ingreso;

class IngresoController extends Controller
{
    // Lista todos los ingresos de un usuario, incluyendo nombre de categoría
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        if (!$userId) {
            return response()->json(['error' => 'Falta user_id'], 400);
        }

        // Trae los ingresos junto con la relación "categoria"
        $ingresos = Ingreso::where('user_id', $userId)
            ->orderBy('fecha', 'desc')
            ->with('categoria')
            ->get()
            ->map(function ($item) {
                $arr = $item->toArray();
                $arr['categoria_nombre'] = $item->categoria->nombre ?? null;
                return $arr;
            });

        return response()->json($ingresos);
    }

    // Crea un nuevo ingreso
    public function store(Request $request)
    {
        $validated = $this->validate($request, [
            'user_id'      => 'required',
            'fecha'        => 'required|date',
            'descripcion'  => 'nullable|string',
            'category_id'  => 'nullable|integer',
            'monto'        => 'required|numeric',
        ]);
        $ingreso = Ingreso::create($validated);
        return response()->json($ingreso, 201);
    }

    // Actualiza un ingreso existente
    public function update(Request $request, $id)
    {
        $ingreso = Ingreso::findOrFail($id);
        $validated = $this->validate($request, [
            'fecha'        => 'required|date',
            'descripcion'  => 'nullable|string',
            'category_id'  => 'nullable|integer',
            'monto'        => 'required|numeric',
        ]);
        $ingreso->update($validated);
        return response()->json($ingreso);
    }

    // Elimina un ingreso
    public function destroy($id)
    {
        $ingreso = Ingreso::findOrFail($id);
        $ingreso->delete();
        return response()->json(['success' => true]);
    }
}