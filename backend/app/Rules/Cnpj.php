<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * CNPJ alfanumérico (padrão da Receita Federal): 12 posições alfanuméricas
 * seguidas de 2 dígitos verificadores numéricos. O cálculo dos DV usa o valor
 * (ASCII - 48) de cada caractere e o módulo 11 com os mesmos pesos do CNPJ
 * numérico. Aceita entrada com ou sem máscara.
 */
final class Cnpj implements ValidationRule
{
    private const DV1_WEIGHTS = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    private const DV2_WEIGHTS = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! self::isValid($value)) {
            $fail('O :attribute informado não é válido.');
        }
    }

    public static function isValid(string $cnpj): bool
    {
        $cnpj = self::sanitize($cnpj);

        if (preg_match('/^[A-Z0-9]{12}[0-9]{2}$/', $cnpj) !== 1) {
            return false;
        }

        if (preg_match('/^(.)\1{11}\d{2}$/', $cnpj) === 1) {
            return false;
        }

        return substr($cnpj, 12, 2) === self::checkDigits(substr($cnpj, 0, 12));
    }

    /** Remove máscara e normaliza para maiúsculas. */
    public static function sanitize(string $cnpj): string
    {
        return strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $cnpj) ?? '');
    }

    /** Recebe as 12 primeiras posições e devolve o CNPJ completo com os 2 DV. */
    public static function complete(string $base): string
    {
        $base = strtoupper($base);

        return $base.self::checkDigits($base);
    }

    private static function checkDigits(string $base): string
    {
        $dv1 = self::digit($base, self::DV1_WEIGHTS);
        $dv2 = self::digit($base.$dv1, self::DV2_WEIGHTS);

        return $dv1.$dv2;
    }

    /** @param  int[]  $weights */
    private static function digit(string $chars, array $weights): string
    {
        $sum = 0;

        foreach (str_split($chars) as $i => $char) {
            $sum += (ord($char) - 48) * $weights[$i];
        }

        $rest = $sum % 11;

        return (string) ($rest < 2 ? 0 : 11 - $rest);
    }
}
