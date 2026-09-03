<?php

declare(strict_types=1);

use App\Enums\Status;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // restrictOnDelete: trava no banco a exclusão física de empresa com produtos.
            $table->foreignId('company_id')->constrained()->restrictOnDelete();
            $table->string('name', 150);
            $table->string('description', 2000)->nullable();
            $table->decimal('price', 12, 2);
            $table->string('internal_code', 50);
            $table->string('status', 20)->default(Status::Active->value)->index();
            // true só quando o produto foi excluído em cascata pela empresa.
            $table->boolean('deleted_via_company')->default(false);
            $table->timestamps();
            $table->softDeletes();
            // Código único por empresa entre os vivos; deleted_at no índice permite
            // reaproveitar o código depois de uma exclusão lógica.
            $table->unique(['company_id', 'internal_code', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
