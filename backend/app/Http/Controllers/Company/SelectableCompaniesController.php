<?php

declare(strict_types=1);

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\UseCases\Company\Cases\ListSelectableCompaniesUseCase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SelectableCompaniesController extends Controller
{
    public function __invoke(Request $request, ListSelectableCompaniesUseCase $useCase): JsonResponse
    {
        $name = $request->query('name');

        return response()->json($useCase->execute(is_string($name) ? $name : null));
    }
}
