<?php

declare(strict_types=1);

namespace App\UseCases\Product\Cases;

use App\Models\Product;
use App\UseCases\Product\DTO\ListProductsDto;
use App\UseCases\Product\Output\ProductOutput;
use Illuminate\Database\Eloquent\Builder;

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
            $query->where('products.name', 'like', '%'.$dto->name.'%');
        }

        if ($dto->status !== null) {
            $query->where('products.status', $dto->status->value);
        }

        if ($dto->company_id !== null) {
            $query->where('products.company_id', $dto->company_id);
        }

        $this->applyOrder($query, $dto);

        $page = $query->paginate(perPage: $dto->per_page, page: $dto->page);

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

    /**
     * A coluna já foi restringida pelo validator. `company` ordena pelo nome da empresa
     * vinculada, o que exige o join; o id desempata para a paginação ficar estável.
     *
     * @param  Builder<Product>  $query
     */
    private function applyOrder(Builder $query, ListProductsDto $dto): void
    {
        $column = $dto->order_by ?? 'name';

        if ($column === 'company') {
            $query->select('products.*')
                ->leftJoin('companies', 'companies.id', '=', 'products.company_id')
                ->orderBy('companies.name', $dto->direction);
        } else {
            $query->orderBy('products.'.$column, $dto->direction);
        }

        $query->orderBy('products.id');
    }
}
