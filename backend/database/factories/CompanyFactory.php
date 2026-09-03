<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\Status;
use App\Models\Company;
use App\Rules\Cnpj;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Company> */
class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'cnpj' => Cnpj::complete(fake()->regexify('[A-Z0-9]{12}')),
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->numerify('###########'),
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
}
