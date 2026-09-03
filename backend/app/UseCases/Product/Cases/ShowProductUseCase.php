<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Models\Product;
use App\UseCases\Product\Output\ProductOutput;

class ShowProductUseCase
{
    /** @return array<string, mixed> */
    public function execute(Product $product): array
    {
        return ['data' => ProductOutput::make($product)];
    }
}
