<?php

declare(strict_types=1);

namespace App\UseCases\Company\Validation;

use App\Rules\Cnpj;
use App\UseCases\Shared\Validation\ValidatorAbstract;

abstract class CompanyPayloadValidator extends ValidatorAbstract
{
    protected function prepare(array $payload): array
    {
        if (isset($payload['cnpj']) && is_string($payload['cnpj'])) {
            $payload['cnpj'] = Cnpj::sanitize($payload['cnpj']);
        }

        if (isset($payload['phone']) && is_string($payload['phone'])) {
            $payload['phone'] = preg_replace('/\D/', '', $payload['phone']) ?? '';
        }

        return $payload;
    }

    protected function messages(): array
    {
        return [
            'phone.regex' => 'O telefone deve conter DDD e ter 10 ou 11 dígitos.',
        ];
    }
}
