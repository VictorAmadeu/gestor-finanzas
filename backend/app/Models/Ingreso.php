<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingreso extends Model
{
    use HasFactory;

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

    // Relación con categoría
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
}