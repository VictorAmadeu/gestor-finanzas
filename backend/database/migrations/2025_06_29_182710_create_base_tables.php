<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Este método crea todas las tablas base del sistema:
     * - categories
     * - ingresos
     * - gastos
     * (NO crea la tabla users)
     */
    public function up()
    {
        // Tabla de categorías (ingresos/gastos)
        Schema::create('categories', function (Blueprint $table) {
            $table->id();                // BIGINT autoincremental
            $table->string('nombre');    // Nombre de la categoría
            $table->timestamps();
        });

        // Tabla de ingresos
        Schema::create('ingresos', function (Blueprint $table) {
            $table->id();                           // BIGINT autoincremental
            $table->uuid('user_id');                // UUID como foreign key
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->decimal('monto', 10, 2);        // Decimal para montos con centavos
            $table->date('fecha');                  // Fecha del ingreso
            $table->string('descripcion')->nullable(); // Descripción opcional
            $table->unsignedBigInteger('category_id')->nullable(); // FK a categorías
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->timestamps();
        });

        // Tabla de gastos
        Schema::create('gastos', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->decimal('monto', 10, 2);
            $table->date('fecha');
            $table->string('descripcion')->nullable();
            $table->unsignedBigInteger('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('gastos');
        Schema::dropIfExists('ingresos');
        Schema::dropIfExists('categories');
        // ¡NO borres la tabla users aquí!
    }
};