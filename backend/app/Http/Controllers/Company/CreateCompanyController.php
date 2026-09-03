<?php

declare(strict_types=1);

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\UseCases\Company\Cases\CreateCompanyUseCase;
use App\UseCases\Company\DTO\CreateCompanyDto;
use App\UseCases\Company\Validation\CreateCompanyValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CreateCompanyController extends Controller
{
    public function __invoke(Request $request, CreateCompanyUseCase $useCase): JsonResponse
    {
        $dto = $this->toDto($request->all(), CreateCompanyValidator::class, CreateCompanyDto::class);

        return response()->json($useCase->execute($dto), 201);
    }
}
