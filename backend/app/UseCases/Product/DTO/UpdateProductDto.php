<?php

declare(strict_types=1);

namespace App\UseCases\Product\DTO;

use App\UseCases\Shared\Dto\DtoAbstract;

/** Sem status: mudança de status é só via inativar/reativar. */
class UpdateProductDto extends DtoAbstract
{
    public int $company_id;

    public string $name;

    public ?string $description;

    public string $price;

    public string $internal_code;
}
