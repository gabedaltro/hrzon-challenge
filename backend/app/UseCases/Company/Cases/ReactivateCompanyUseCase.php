<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Enums\Status;
use App\Exceptions\BusinessRuleException;
use App\Models\Company;
use App\UseCases\Company\Output\CompanyOutput;

class ReactivateCompanyUseCase
{
    /** @return array<string, mixed> */
    public function execute(Company $company): array
    {
        if ($company->trashed()) {
            throw new BusinessRuleException('Não é possível reativar uma empresa excluída.');
        }

        if ($company->isActive()) {
            throw new BusinessRuleException('A empresa já está ativa.');
        }

        // Sem cascata: a reativação dos produtos é individual.
        $company->update(['status' => Status::Active]);

        return ['data' => CompanyOutput::make($company->refresh())];
    }
}
