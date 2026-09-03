<?php

declare(strict_types=1);

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\UseCases\Company\Cases\ListCompaniesUseCase;
use App\UseCases\Company\DTO\ListCompaniesDto;
use App\UseCases\Company\Validation\ListCompaniesValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ListCompaniesController extends Controller
{
    public function __invoke(Request $request, ListCompaniesUseCase $useCase): JsonResponse
    {
        $dto = $this->toDto($request->query(), ListCompaniesValidator::class, ListCompaniesDto::class);

        return response()->json($useCase->execute($dto));
    }
}
