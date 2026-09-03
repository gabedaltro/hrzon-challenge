<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Product;

class ForceDeleteProductUseCase
{
    public function execute(Product $product): void
    {
        if (! $product->trashed()) {
            throw new BusinessRuleException('A exclusão definitiva só é permitida para produtos já excluídos.');
        }

        $product->forceDelete();
    }
}
