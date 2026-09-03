<?php

declare(strict_types=1);

namespace App\UseCases\Company\Validation;

use App\Enums\Status;
use App\Rules\Cnpj;
use Illuminate\Validation\Rule;

class CreateCompanyValidator extends CompanyPayloadValidator
{
    protected function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:150'],
            'cnpj' => ['required', 'string', new Cnpj, Rule::unique('companies', 'cnpj')],
            'email' => ['required', 'email', 'max:255', Rule::unique('companies', 'email')],
            'phone' => ['required', 'string', 'regex:/^\d{10,11}$/'],
            'status' => ['sometimes', Rule::enum(Status::class)],
        ];
    }
}
