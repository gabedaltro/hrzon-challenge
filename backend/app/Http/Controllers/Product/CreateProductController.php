<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\UseCases\Product\Cases\CreateProductUseCase;
use App\UseCases\Product\DTO\CreateProductDto;
use App\UseCases\Product\Validation\CreateProductValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreateProductController extends Controller
{
    public function __invoke(Request $request, CreateProductUseCase $useCase): JsonResponse
    {
        $dto = $this->toDto($request->all(), CreateProductValidator::class, CreateProductDto::class);

        return response()->json($useCase->execute($dto), 201);
    }
}
