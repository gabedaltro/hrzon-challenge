<?php

declare(strict_types=1);

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\UseCases\Product\Cases\ListProductsUseCase;
use App\UseCases\Product\DTO\ListProductsDto;
use App\UseCases\Product\Validation\ListProductsValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListProductsController extends Controller
{
    public function __invoke(Request $request, ListProductsUseCase $useCase): JsonResponse
    {
        $dto = $this->toDto($request->query(), ListProductsValidator::class, ListProductsDto::class);

        return response()->json($useCase->execute($dto));
    }
}
