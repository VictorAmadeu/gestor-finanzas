<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gasto; // Asegúrate de tener el modelo Gasto creado

class GastoController extends Controller
{
    // Lista todos los gastos de un usuario
    public function index(Request $request)
    {
        $userId = $request->query('user_id');
        return Gasto::where('user_id', $userId)
            ->orderBy('fecha', 'desc')
            ->get();
    }

    // Crea un nuevo gasto
    public function store(Request $request)
    {
        // Usamos el validador del controlador para asegurar compatibilidad
        $validated = $this->validate($request, [
            'user_id' => 'required|exists:users,id',
            'fecha' => 'required|date',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'nullable|integer',
            'monto' => 'required|numeric',
        ]);
        $gasto = Gasto::create($validated);
        return response()->json($gasto, 201);
    }


    // Actualiza un gasto existente
    public function update(Request $request, $id)
    {
        $gasto = Gasto::findOrFail($id);
        $validated = $this->validate($request, [
            'fecha' => 'required|date',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'nullable|integer',
            'monto' => 'required|numeric',
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