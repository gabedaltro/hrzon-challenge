<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Status;
use App\Models\Company;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Product> */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => ucfirst(fake()->words(3, true)),
            'description' => fake()->optional()->sentence(12),
            'price' => fake()->randomFloat(2, 1, 5000),
            'internal_code' => strtoupper(fake()->unique()->bothify('sku-####??')),
            'status' => Status::Active,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['status' => Status::Inactive]);
    }

    public function trashed(): static
    {
        return $this->state(['deleted_at' => now()]);
    }

    public function deletedViaCompany(): static
    {
        return $this->state([
            'deleted_at' => now(),
            'deleted_via_company' => true,
        ]);
    }
}
