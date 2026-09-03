<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Models\Company;
use App\UseCases\Company\Output\CompanyOutput;

class ShowCompanyUseCase
{
    /** @return array<string, mixed> */
    public function execute(Company $company): array
    {
        return ['data' => CompanyOutput::make($company)];
    }
}
