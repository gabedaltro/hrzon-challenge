<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Company;
use App\UseCases\Company\Output\CompanyOutput;
use Illuminate\Support\Facades\DB;

/** Exclusão lógica da empresa com cascata para os produtos. */
class DeleteCompanyUseCase
{
    /** @return array<string, mixed> */
    public function execute(Company $company): array
    {
        if ($company->trashed()) {
            throw new BusinessRuleException('A empresa já está excluída.');
        }

        DB::transaction(function () use ($company) {
            // Só os produtos vivos entram na cascata; os já excluídos
            // individualmente continuam com deleted_via_company = false.
            $company->products()->update(['deleted_via_company' => true]);
            $company->products()->delete();

            $company->delete();
        });

        return ['data' => CompanyOutput::make($company->refresh())];
    }
}
