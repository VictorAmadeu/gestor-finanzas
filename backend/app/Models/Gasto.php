<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category; // Importa el modelo Category

class Gasto extends Model
{
    use HasFactory;

    // Campos que se pueden asignar masivamente
    protected $fillable = [
        'user_id',
        'monto',
        'fecha',
        'descripcion',
        'category_id',
    ];

    // Relación con usuario (UUID)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Relación con categoría (¡CORRECTA!)
    public function categoria()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}