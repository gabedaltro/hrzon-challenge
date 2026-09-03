<?php

declare(strict_types=1);

namespace App\UseCases\Company\DTO;

use App\Enums\Status;
use App\UseCases\Shared\Dto\DtoAbstract;

class CreateCompanyDto extends DtoAbstract
{
    public string $name;

    public string $cnpj;

    public string $email;

    public string $phone;

    public Status $status;
}
