<?php

declare(strict_types=1);

namespace App\UseCases\Shared\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

abstract class ValidatorAbstract
{
    /** @return array<string, mixed> */
    abstract protected function rules(): array;

    /** @return array<string, string> */
    protected function messages(): array
    {
        return [];
    }

    /** @return array<string, string> */
    protected function attributes(): array
    {
        return [];
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function validate(array $payload): array
    {
        return Validator::make(
            $payload,
            $this->rules(),
            $this->messages(),
            $this->attributes(),
        )->validate();
    }
}
