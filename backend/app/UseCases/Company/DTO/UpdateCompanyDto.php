<?php

declare(strict_types=1);

namespace App\UseCases\Company\DTO;

use App\UseCases\Shared\Dto\DtoAbstract;

/** Sem status: mudança de status é só via inativar/reativar. */
class UpdateCompanyDto extends DtoAbstract
{
    public string $name;

    public string $cnpj;

    public string $email;

    public string $phone;
}
