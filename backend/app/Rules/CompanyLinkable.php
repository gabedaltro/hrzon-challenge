<?php

declare(strict_types=1);

namespace App\Rules;

use App\Models\Company;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/** A empresa precisa existir, estar ativa e não excluída para receber um produto. */
final class CompanyLinkable implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $company = Company::withTrashed()->find($value);

        if ($company === null) {
            $fail('A empresa selecionada não existe.');

            return;
        }

        if ($company->trashed()) {
            $fail('A empresa selecionada está excluída.');

            return;
        }

        if (! $company->isActive()) {
            $fail('A empresa selecionada está inativa.');
        }
    }
}
