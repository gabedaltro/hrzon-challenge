<?php

declare(strict_types=1);

namespace App\UseCases\Product\DTO;

use App\Enums\Status;
use App\UseCases\Shared\Dto\DtoAbstract;

class CreateProductDto extends DtoAbstract
{
    public int $company_id;

    public string $name;

    public ?string $description;

    public string $price;

    public string $internal_code;

    public Status $status;
}
