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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            // CNPJ alfanumérico (padrão Receita Federal), guardado sem máscara.
            // unique simples cobre a regra de não duplicar nem entre excluídos.
            $table->string('cnpj', 14)->unique();
            $table->string('email')->unique();
            $table->string('phone', 20);
            $table->string('status', 20)->default(Status::Active->value)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
