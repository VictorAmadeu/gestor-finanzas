<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];

    // Si quieres acceder desde Ingreso/Gasto, puedes poner:
    // (opcional, solo si necesitas ver todos los ingresos/gastos de una categoría)
    public function ingresos() {
        return $this->hasMany(Ingreso::class, 'category_id');
    }
    public function gastos() {
        return $this->hasMany(Gasto::class, 'category_id');
    }
}