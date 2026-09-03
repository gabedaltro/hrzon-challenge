<?php

declare(strict_types=1);

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\UseCases\Company\Cases\UpdateCompanyUseCase;
use App\UseCases\Company\DTO\UpdateCompanyDto;
use App\UseCases\Company\Validation\UpdateCompanyValidator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UpdateCompanyController extends Controller
{
    public function __invoke(Request $request, Company $company, UpdateCompanyUseCase $useCase): JsonResponse
    {
        $dto = $this->toDto(
            $request->all(),
            new UpdateCompanyValidator($company->id),
            UpdateCompanyDto::class,
        );

        return response()->json($useCase->execute($company, $dto));
    }
}
