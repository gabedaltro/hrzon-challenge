<?php

declare(strict_types=1);

namespace App\UseCases\Product\Validation;

use App\Rules\CompanyLinkable;
use App\UseCases\Shared\Validation\ValidatorAbstract;
use Illuminate\Validation\Rule;

abstract class ProductPayloadValidator extends ValidatorAbstract
{
    /** @return array<string, mixed> */
    protected function commonRules(): array
    {
        return [
            'company_id' => ['required', 'integer', new CompanyLinkable],
            'name' => ['required', 'string', 'min:3', 'max:150'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'gt:0', 'decimal:0,2'],
        ];
    }

    /**
     * Código interno único por empresa entre os produtos não excluídos.
     *
     * @return array<int, mixed>
     */
    protected function internalCodeRule(?int $ignoreId = null): array
    {
        $unique = Rule::unique('products', 'internal_code')->where(
            fn ($query) => $query
                ->where('company_id', (int) ($this->payload['company_id'] ?? 0))
                ->whereNull('deleted_at')
        );

        if ($ignoreId !== null) {
            $unique->ignore($ignoreId);
        }

        return ['required', 'string', 'max:50', $unique];
    }

    protected function messages(): array
    {
        return [
            'price.decimal' => 'O preço deve ter no máximo duas casas decimais.',
            'price.gt' => 'O preço deve ser maior que zero.',
            'internal_code.unique' => 'Já existe um produto com esse código interno nesta empresa.',
        ];
    }
}
