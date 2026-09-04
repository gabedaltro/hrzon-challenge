<?php

declare(strict_types=1);

namespace App\UseCases\Company\DTO;

use App\Enums\Status;
use App\UseCases\Shared\Dto\DtoAbstract;

class ListCompaniesDto extends DtoAbstract
{
    public ?string $name = null;

    public ?Status $status = null;

    /** without | with | only */
    public string $trashed = 'without';

    public int $page = 1;

    public int $per_page = 15;

    /** Coluna da ordenação; null usa o nome. */
    public ?string $order_by = null;

    /** asc | desc */
    public string $direction = 'asc';
}
