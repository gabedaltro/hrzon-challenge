<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\UseCases\Product\Cases\ForceDeleteProductUseCase;
use Illuminate\Http\Response;

class ForceDeleteProductController extends Controller
{
    public function __invoke(Product $product, ForceDeleteProductUseCase $useCase): Response
    {
        $useCase->execute($product);

        return response()->noContent();
    }
}
