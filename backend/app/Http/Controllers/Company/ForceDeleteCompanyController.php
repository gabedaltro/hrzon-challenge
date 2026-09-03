<?php

declare(strict_types=1);

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\UseCases\Company\Cases\ForceDeleteCompanyUseCase;
use Illuminate\Http\Response;

class ForceDeleteCompanyController extends Controller
{
    public function __invoke(Company $company, ForceDeleteCompanyUseCase $useCase): Response
    {
        $useCase->execute($company);

        return response()->noContent();
    }
}
