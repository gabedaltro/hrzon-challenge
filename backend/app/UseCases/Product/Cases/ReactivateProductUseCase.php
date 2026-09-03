<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Enums\Status;
use App\Exceptions\BusinessRuleException;
use App\Models\Product;
use App\UseCases\Product\Output\ProductOutput;

class ReactivateProductUseCase
{
    /** @return array<string, mixed> */
    public function execute(Product $product): array
    {
        if ($product->trashed()) {
            throw new BusinessRuleException('Não é possível reativar um produto excluído.');
        }

        if ($product->isActive()) {
            throw new BusinessRuleException('O produto já está ativo.');
        }

        $product->loadMissing(['company' => fn ($q) => $q->withTrashed()]);

        if (! $product->company->canReceiveProducts()) {
            throw new BusinessRuleException(
                'Não é possível ativar um produto cuja empresa está inativa ou excluída.'
            );
        }

        $product->update(['status' => Status::Active]);

        return ['data' => ProductOutput::make($product->refresh())];
    }
}
