<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Company;

class ForceDeleteCompanyUseCase
{
    public function execute(Company $company): void
    {
        if (! $company->trashed()) {
            throw new BusinessRuleException('A exclusão definitiva só é permitida para empresas já excluídas.');
        }

        if ($company->products()->withTrashed()->exists()) {
            throw BusinessRuleException::conflict(
                'Não é possível excluir definitivamente uma empresa que possui produtos vinculados.'
            );
        }

        $company->forceDelete();
    }
}
