<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Models\Product;
use App\UseCases\Product\DTO\ListProductsDto;
use App\UseCases\Product\Output\ProductOutput;

class ListProductsUseCase
{
    /** @return array<string, mixed> */
    public function execute(ListProductsDto $dto): array
    {
        $query = Product::query()
            ->with(['company' => fn ($q) => $q->withTrashed()]);

        match ($dto->trashed) {
            'with' => $query->withTrashed(),
            'only' => $query->onlyTrashed(),
            default => null,
        };

        if ($dto->name !== null && $dto->name !== '') {
            $query->where('name', 'like', '%'.$dto->name.'%');
        }

        if ($dto->status !== null) {
            $query->where('status', $dto->status->value);
        }

        if ($dto->company_id !== null) {
            $query->where('company_id', $dto->company_id);
        }

        $page = $query->orderBy('name')->paginate(perPage: $dto->per_page, page: $dto->page);

        return [
            'data' => array_map(ProductOutput::make(...), $page->items()),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
            ],
        ];
    }
}
