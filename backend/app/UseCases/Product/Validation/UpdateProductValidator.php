<?php

declare(strict_types=1);

namespace App\UseCases\Product\Validation;

class UpdateProductValidator extends ProductPayloadValidator
{
    public function __construct(private readonly int $productId) {}

    protected function rules(): array
    {
        return [
            ...$this->commonRules(),
            'internal_code' => $this->internalCodeRule($this->productId),
        ];
    }
}
