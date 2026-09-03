<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Models\Product;
use App\UseCases\Product\DTO\CreateProductDto;
use App\UseCases\Product\Output\ProductOutput;

class CreateProductUseCase
{
    /** @return array<string, mixed> */
    public function execute(CreateProductDto $dto): array
    {
        $product = Product::create($dto->toArray());

        return ['data' => ProductOutput::make($product->refresh())];
    }
}
