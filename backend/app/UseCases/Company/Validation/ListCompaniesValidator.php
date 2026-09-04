<?php

declare(strict_types=1);

namespace App\UseCases\Company\Validation;

use App\Enums\Status;
use App\UseCases\Shared\Validation\ValidatorAbstract;
use Illuminate\Validation\Rule;

class ListCompaniesValidator extends ValidatorAbstract
{
    /** Colunas liberadas para ordenação. */
    public const SORTABLE = ['name', 'cnpj', 'email', 'phone', 'products_count', 'status', 'created_at'];

    protected function rules(): array
    {
        return [
            'name' => ['sometimes', 'nullable', 'string', 'max:150'],
            'status' => ['sometimes', 'nullable', Rule::enum(Status::class)],
            'trashed' => ['sometimes', Rule::in(['without', 'with', 'only'])],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'order_by' => ['sometimes', 'nullable', Rule::in(self::SORTABLE)],
            'direction' => ['sometimes', Rule::in(['asc', 'desc'])],
        ];
    }
}
