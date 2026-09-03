<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\UseCases\Shared\Dto\DtoAbstract;
use App\UseCases\Shared\Validation\ValidatorAbstract;
use Illuminate\Validation\ValidationException;

abstract class Controller
{
    /**
     * Valida o payload e devolve o DTO preenchido só com os dados validados.
     *
     * @template TDto of DtoAbstract
     *
     * @param  array<string, mixed>  $payload
     * @param  class-string<ValidatorAbstract>  $validator
     * @param  class-string<TDto>  $dto
     * @return TDto
     *
     * @throws ValidationException
     */
    protected function toDto(array $payload, string $validator, string $dto): DtoAbstract
    {
        $validated = (new $validator)->validate($payload);

        return new $dto($validated);
    }
}
