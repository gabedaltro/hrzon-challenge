<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Company;
use App\UseCases\Company\Output\CompanyOutput;
use Illuminate\Support\Facades\DB;

/** Restaura a empresa e só os produtos que caíram junto com ela. */
class RestoreCompanyUseCase
{
    /** @return array<string, mixed> */
    public function execute(Company $company): array
    {
        if (! $company->trashed()) {
            throw new BusinessRuleException('A empresa não está excluída.');
        }

        DB::transaction(function () use ($company) {
            $company->restore();

            $company->products()
                ->onlyTrashed()
                ->where('deleted_via_company', true)
                ->restore();

            $company->products()
                ->where('deleted_via_company', true)
                ->update(['deleted_via_company' => false]);
        });

        return ['data' => CompanyOutput::make($company->refresh())];
    }
}
