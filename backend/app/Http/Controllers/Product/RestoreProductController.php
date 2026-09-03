<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\UseCases\Product\Cases\RestoreProductUseCase;
use Illuminate\Http\JsonResponse;

class RestoreProductController extends Controller
{
    public function __invoke(Product $product, RestoreProductUseCase $useCase): JsonResponse
    {
        return response()->json($useCase->execute($product));
    }
}
