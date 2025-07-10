<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ingreso; // Asegúrate de tener el modelo Ingreso creado

class IngresoController extends Controller
{
    // Lista todos los ingresos de un usuario
    public function index(Request $request)
    {
        $userId = $request->query('user_id'); // Recibe user_id por query string
        // Retorna todos los ingresos del usuario, ordenados por fecha descendente
        return Ingreso::where('user_id', $userId)
            ->orderBy('fecha', 'desc')
            ->get();
    }

    // Crea un nuevo ingreso
    public function store(Request $request)
    {
        // Usar el helper de validación del controlador para mayor compatibilidad
        $validated = $this->validate($request, [
            'user_id' => 'required',
            'fecha' => 'required|date',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'nullable|integer',
            'monto' => 'required|numeric',
        ]);
        $ingreso = Ingreso::create($validated);
        return response()->json($ingreso, 201);
    }

    // Actualiza un ingreso existente
    public function update(Request $request, $id)
    {
        $ingreso = Ingreso::findOrFail($id);
        $validated = $this->validate($request, [
            'fecha' => 'required|date',
            'descripcion' => 'nullable|string',
            'categoria_id' => 'nullable|integer',
            'monto' => 'required|numeric',
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