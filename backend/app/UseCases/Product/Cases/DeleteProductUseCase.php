<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Product;
use App\UseCases\Product\Output\ProductOutput;

/** Exclusão lógica individual: deleted_via_company continua false. */
class DeleteProductUseCase
{
    /** @return array<string, mixed> */
    public function execute(Product $product): array
    {
        if ($product->trashed()) {
            throw new BusinessRuleException('O produto já está excluído.');
        }

        $product->delete();

        return ['data' => ProductOutput::make($product->refresh())];
    }
}
