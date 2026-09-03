<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Enums\Status;
use App\Exceptions\BusinessRuleException;
use App\Models\Company;
use App\UseCases\Company\Output\CompanyOutput;
use Illuminate\Support\Facades\DB;

class InactivateCompanyUseCase
{
    /** @return array<string, mixed> */
    public function execute(Company $company): array
    {
        if ($company->trashed()) {
            throw new BusinessRuleException('Não é possível inativar uma empresa excluída.');
        }

        if (! $company->isActive()) {
            throw new BusinessRuleException('A empresa já está inativa.');
        }

        DB::transaction(function () use ($company) {
            $company->update(['status' => Status::Inactive]);

            // Inclui os excluídos: assim, se voltarem depois, já vêm inativos
            // (não se pode ativar produto de empresa inativa).
            $company->products()->withTrashed()->update(['status' => Status::Inactive->value]);
        });

        return ['data' => CompanyOutput::make($company->refresh())];
    }
}
