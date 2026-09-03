<?php

declare(strict_types=1);

namespace App\UseCases\Company\Validation;

use App\Rules\Cnpj;
use Illuminate\Validation\Rule;

class UpdateCompanyValidator extends CompanyPayloadValidator
{
    public function __construct(private readonly int $companyId) {}

    protected function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:3', 'max:150'],
            'cnpj' => ['required', 'string', new Cnpj, Rule::unique('companies', 'cnpj')->ignore($this->companyId)],
            'email' => ['required', 'email', 'max:255', Rule::unique('companies', 'email')->ignore($this->companyId)],
            'phone' => ['required', 'string', 'regex:/^\d{10,11}$/'],
        ];
    }
}
