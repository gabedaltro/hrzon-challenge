<?php

declare(strict_types=1);

namespace App\UseCases\Shared\Validation;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

abstract class ValidatorAbstract
{
    protected array $payload = [];

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
     * Normaliza o payload antes da validação (ex.: tirar máscara).
     *
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     */
    protected function prepare(array $payload): array
    {
        return $payload;
    }

    /**
     * @param  array<string, mixed>  $payload
     * @return array<string, mixed>
     *
     * @throws ValidationException
     */
    public function validate(array $payload): array
    {
        $this->payload = $this->prepare($payload);

        return Validator::make(
            $this->payload,
            $this->rules(),
            $this->messages(),
            $this->attributes(),
        )->validate();
    }
}
