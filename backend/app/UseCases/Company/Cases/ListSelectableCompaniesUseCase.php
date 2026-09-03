<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Enums\Status;
use App\Models\Company;
use App\Rules\Cnpj;

/** Empresas aptas a receber vínculo de produto: ativas e não excluídas. */
class ListSelectableCompaniesUseCase
{
    /** @return array<string, mixed> */
    public function execute(?string $name = null): array
    {
        $companies = Company::query()
            ->where('status', Status::Active->value)
            ->when(
                $name !== null && $name !== '',
                fn ($query) => $query->where('name', 'like', '%'.$name.'%')
            )
            ->orderBy('name')
            ->limit(100)
            ->get(['id', 'name', 'cnpj']);

        return [
            'data' => $companies->map(fn (Company $company) => [
                'id' => $company->id,
                'name' => $company->name,
                'cnpj_formatted' => Cnpj::format($company->cnpj),
            ])->all(),
        ];
    }
}
