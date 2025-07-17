<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto;

class GastoController extends Controller
{
    // Lista todos los gastos de un usuario, incluyendo nombre de categoría
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        if (!$userId) {
            return response()->json(['error' => 'Falta user_id'], 400);
        }

        // Trae los gastos junto con la relación "categoria"
        $gastos = Gasto::where('user_id', $userId)
            ->orderBy('fecha', 'desc')
            ->with('categoria')
            ->get()
            ->map(function ($item) {
                $arr = $item->toArray();
                $arr['categoria_nombre'] = $item->categoria->nombre ?? null;
                return $arr;
            });

        return response()->json($gastos);
    }

    // Crea un nuevo gasto
    public function store(Request $request)
    {
        $validated = $this->validate($request, [
            'user_id'      => 'required',
            'fecha'        => 'required|date',
            'descripcion'  => 'nullable|string',
            'category_id'  => 'nullable|integer',
            'monto'        => 'required|numeric',
        ]);
        $gasto = Gasto::create($validated);
        return response()->json($gasto, 201);
    }

    // Actualiza un gasto existente
    public function update(Request $request, $id)
    {
        $gasto = Gasto::findOrFail($id);
        $validated = $this->validate($request, [
            'fecha'        => 'required|date',
            'descripcion'  => 'nullable|string',
            'category_id'  => 'nullable|integer',
            'monto'        => 'required|numeric',
        ]);
        $gasto->update($validated);
        return response()->json($gasto);
    }

    // Elimina un gasto
    public function destroy($id)
    {
        $gasto = Gasto::findOrFail($id);
        $gasto->delete();
        return response()->json(['success' => true]);
    }
}