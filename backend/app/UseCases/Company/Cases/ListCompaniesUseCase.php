<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Models\Company;
use App\UseCases\Company\DTO\ListCompaniesDto;
use App\UseCases\Company\Output\CompanyOutput;
use Illuminate\Database\Eloquent\Builder;

class ListCompaniesUseCase
{
    /** @return array<string, mixed> */
    public function execute(ListCompaniesDto $dto): array
    {
        $query = Company::query()
            ->withCount(['products as products_count' => fn (Builder $q) => $q->withTrashed()]);

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

        // A coluna já foi restringida pelo validator; o id desempata para a paginação ficar estável.
        $query->orderBy($dto->order_by ?? 'name', $dto->direction)->orderBy('id');

        $page = $query->paginate(perPage: $dto->per_page, page: $dto->page);

        return [
            'data' => array_map(CompanyOutput::make(...), $page->items()),
            'meta' => [
                'current_page' => $page->currentPage(),
                'last_page' => $page->lastPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
            ],
        ];
    }
}
