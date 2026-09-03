<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Product;
use App\UseCases\Product\DTO\UpdateProductDto;
use App\UseCases\Product\Output\ProductOutput;

class UpdateProductUseCase
{
    /** @return array<string, mixed> */
    public function execute(Product $product, UpdateProductDto $dto): array
    {
        if ($product->trashed()) {
            throw new BusinessRuleException('Não é possível editar um produto excluído.');
        }

        $product->update($dto->toArray());

        return ['data' => ProductOutput::make($product->refresh())];
    }
}
