<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Empresas ativas com produtos ativos.
        Company::factory(8)
            ->has(Product::factory()->count(4))
            ->create();

        // Empresas inativas: seus produtos também ficam inativos.
        Company::factory(2)
            ->inactive()
            ->has(Product::factory()->count(3)->inactive())
            ->create();

        // Empresa excluída logicamente: produtos excluídos em cascata.
        Company::factory()
            ->trashed()
            ->has(Product::factory()->count(3)->deletedViaCompany())
            ->create();

        // Empresa ativa com produtos em estados individuais diferentes.
        $company = Company::factory()->create();
        Product::factory()->count(3)->for($company)->create();
        Product::factory()->for($company)->inactive()->create();
        Product::factory()->for($company)->trashed()->create();
    }
}
