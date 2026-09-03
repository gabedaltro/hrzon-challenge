<?php

declare(strict_types=1);

namespace App\UseCases\Company\Output;

use App\Models\Company;
use App\Rules\Cnpj;

class CompanyOutput
{
    /** @return array<string, mixed> */
    public static function make(Company $company): array
    {
        $trashed = $company->trashed();
        $productsCount = self::productsCount($company);

        return [
            'id' => $company->id,
            'name' => $company->name,
            'cnpj' => $company->cnpj,
            'cnpj_formatted' => Cnpj::format($company->cnpj),
            'email' => $company->email,
            'phone' => $company->phone,
            'status' => $company->status->value,
            'status_label' => $company->status->label(),
            'is_active' => $company->isActive(),
            'is_trashed' => $trashed,
            'products_count' => $productsCount,
            'created_at' => $company->created_at,
            'updated_at' => $company->updated_at,
            'deleted_at' => $company->deleted_at,
            'permissions' => [
                'update' => ! $trashed,
                'inactivate' => ! $trashed && $company->isActive(),
                'reactivate' => ! $trashed && ! $company->isActive(),
                'delete' => ! $trashed,
                'restore' => $trashed,
                'force_delete' => $trashed && $productsCount === 0,
            ],
        ];
    }

    private static function productsCount(Company $company): int
    {
        return $company->products_count
            ?? $company->products()->withTrashed()->count();
    }
}
