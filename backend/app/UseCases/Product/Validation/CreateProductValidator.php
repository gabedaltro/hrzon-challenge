<?php

declare(strict_types=1);

namespace App\UseCases\Product\Validation;

use App\Enums\Status;
use Illuminate\Validation\Rule;

class CreateProductValidator extends ProductPayloadValidator
{
    protected function rules(): array
    {
        return [
            ...$this->commonRules(),
            'internal_code' => $this->internalCodeRule(),
            'status' => ['sometimes', Rule::enum(Status::class)],
        ];
    }
}
