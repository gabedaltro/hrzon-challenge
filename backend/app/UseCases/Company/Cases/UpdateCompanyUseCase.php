<?php

declare(strict_types=1);

namespace App\UseCases\Company\Cases;

use App\Exceptions\BusinessRuleException;
use App\Models\Company;
use App\UseCases\Company\DTO\UpdateCompanyDto;
use App\UseCases\Company\Output\CompanyOutput;

class UpdateCompanyUseCase
{
    /** @return array<string, mixed> */
    public function execute(Company $company, UpdateCompanyDto $dto): array
    {
        if ($company->trashed()) {
            throw new BusinessRuleException('Não é possível editar uma empresa excluída.');
        }

        $company->update($dto->toArray());

        return ['data' => CompanyOutput::make($company->refresh())];
    }
}
