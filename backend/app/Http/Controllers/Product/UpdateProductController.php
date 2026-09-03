<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\UseCases\Product\Cases\UpdateProductUseCase;
use App\UseCases\Product\DTO\UpdateProductDto;
use App\UseCases\Product\Validation\UpdateProductValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UpdateProductController extends Controller
{
    public function __invoke(Request $request, Product $product, UpdateProductUseCase $useCase): JsonResponse
    {
        $dto = $this->toDto(
            $request->all(),
            new UpdateProductValidator($product->id),
            UpdateProductDto::class,
        );

        return response()->json($useCase->execute($product, $dto));
    }
}
