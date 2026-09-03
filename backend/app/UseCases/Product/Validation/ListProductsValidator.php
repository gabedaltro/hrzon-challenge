<?php

declare(strict_types=1);

namespace App\UseCases\Product\Validation;

use App\Enums\Status;
use App\UseCases\Shared\Validation\ValidatorAbstract;
use Illuminate\Validation\Rule;

class ListProductsValidator extends ValidatorAbstract
{
    protected function rules(): array
    {
        return [
            'name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'status' => ['sometimes', 'nullable', Rule::enum(Status::class)],
            'company_id' => ['sometimes', 'nullable', 'integer'],
            'trashed' => ['sometimes', Rule::in(['without', 'with', 'only'])],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
