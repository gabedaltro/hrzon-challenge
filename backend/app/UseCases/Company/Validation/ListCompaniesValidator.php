<?php

declare(strict_types=1);

namespace App\UseCases\Company\Validation;

use App\Enums\Status;
use App\UseCases\Shared\Validation\ValidatorAbstract;
use Illuminate\Validation\Rule;

class ListCompaniesValidator extends ValidatorAbstract
{
    protected function rules(): array
    {
        return [
            'name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'status' => ['sometimes', 'nullable', Rule::enum(Status::class)],
            'trashed' => ['sometimes', Rule::in(['without', 'with', 'only'])],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ];
    }
}
