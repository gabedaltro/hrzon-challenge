<?php

declare(strict_types=1);

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\UseCases\Company\Cases\ShowCompanyUseCase;
use Illuminate\Http\JsonResponse;

class ShowCompanyController extends Controller
{
    public function __invoke(Company $company, ShowCompanyUseCase $useCase): JsonResponse
    {
        return response()->json($useCase->execute($company));
    }
}
