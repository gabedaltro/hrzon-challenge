<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\UseCases\Product\Cases\ShowProductUseCase;
use Illuminate\Http\JsonResponse;

class ShowProductController extends Controller
{
    public function __invoke(Product $product, ShowProductUseCase $useCase): JsonResponse
    {
        return response()->json($useCase->execute($product));
    }
}
