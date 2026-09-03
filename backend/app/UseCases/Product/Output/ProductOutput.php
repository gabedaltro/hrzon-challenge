<?php

declare(strict_types=1);

namespace App\UseCases\Product\Output;

use App\Models\Product;

class ProductOutput
{
    /** @return array<string, mixed> */
    public static function make(Product $product): array
    {
        $product->loadMissing(['company' => fn ($q) => $q->withTrashed()]);

        $trashed = $product->trashed();
        $companyLinkable = $product->company?->canReceiveProducts() ?? false;

        return [
            'id' => $product->id,
            'company_id' => $product->company_id,
            'company' => $product->company === null ? null : [
                'id' => $product->company->id,
                'name' => $product->company->name,
                'status' => $product->company->status->value,
                'is_trashed' => $product->company->trashed(),
            ],
            'name' => $product->name,
            'description' => $product->description,
            'price' => $product->price,
            'internal_code' => $product->internal_code,
            'status' => $product->status->value,
            'status_label' => $product->status->label(),
            'is_active' => $product->isActive(),
            'is_trashed' => $trashed,
            'deleted_via_company' => $product->deleted_via_company,
            'created_at' => $product->created_at,
            'updated_at' => $product->updated_at,
            'deleted_at' => $product->deleted_at,
            'permissions' => [
                'update' => ! $trashed,
                'inactivate' => ! $trashed && $product->isActive(),
                'reactivate' => ! $trashed && ! $product->isActive() && $companyLinkable,
                'delete' => ! $trashed,
                'restore' => $trashed && ! $product->deleted_via_company && $companyLinkable,
                'force_delete' => $trashed,
            ],
        ];
    }
}
