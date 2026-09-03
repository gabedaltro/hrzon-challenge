<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Product;
use App\UseCases\Product\Output\ProductOutput;

class RestoreProductUseCase
{
    /** @return array<string, mixed> */
    public function execute(Product $product): array
    {
        if (! $product->trashed()) {
            throw new BusinessRuleException('O produto não está excluído.');
        }

        $product->loadMissing(['company' => fn ($q) => $q->withTrashed()]);

        if (! $product->company->canReceiveProducts()) {
            throw new BusinessRuleException(
                'Não é possível restaurar um produto cuja empresa está inativa ou excluída.'
            );
        }

        $collision = Product::query()
            ->where('company_id', $product->company_id)
            ->where('internal_code', $product->internal_code)
            ->exists();

        if ($collision) {
            throw BusinessRuleException::conflict(
                "Já existe um produto ativo com o código interno {$product->internal_code} nesta empresa."
            );
        }

        $product->restore();

        return ['data' => ProductOutput::make($product->refresh())];
    }
}
