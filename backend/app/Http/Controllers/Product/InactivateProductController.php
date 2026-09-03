<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\UseCases\Product\Cases\InactivateProductUseCase;
use Illuminate\Http\JsonResponse;

class InactivateProductController extends Controller
{
    public function __invoke(Product $product, InactivateProductUseCase $useCase): JsonResponse
    {
        return response()->json($useCase->execute($product));
    }
}
