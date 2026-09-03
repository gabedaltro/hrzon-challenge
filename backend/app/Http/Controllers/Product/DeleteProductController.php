<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\UseCases\Product\Cases\DeleteProductUseCase;
use Illuminate\Http\JsonResponse;

class DeleteProductController extends Controller
{
    public function __invoke(Product $product, DeleteProductUseCase $useCase): JsonResponse
    {
        return response()->json($useCase->execute($product));
    }
}
