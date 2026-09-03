<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Rules\Cnpj;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

class CnpjRuleTest extends TestCase
{
    #[DataProvider('validCnpjs')]
    public function test_accepts_valid_cnpj(string $cnpj): void
    {
        $this->assertTrue(Cnpj::isValid($cnpj));
    }

    #[DataProvider('invalidCnpjs')]
    public function test_rejects_invalid_cnpj(string $cnpj): void
    {
        $this->assertFalse(Cnpj::isValid($cnpj));
    }

    public function test_complete_appends_check_digits(): void
    {
        $this->assertSame('12ABC34501DE35', Cnpj::complete('12ABC34501DE'));
    }

    public function test_sanitize_strips_mask_and_uppercases(): void
    {
        $this->assertSame('12ABC34501DE35', Cnpj::sanitize('12.abc.345/01de-35'));
    }

    /** @return array<string, array{string}> */
    public static function validCnpjs(): array
    {
        return [
            'alfanumérico' => ['12ABC34501DE35'],
            'alfanumérico com máscara' => ['12.ABC.345/01DE-35'],
            'alfanumérico minúsculo' => ['12abc34501de35'],
            'numérico (retrocompatível)' => ['11222333000181'],
        ];
    }

    /** @return array<string, array{string}> */
    public static function invalidCnpjs(): array
    {
        return [
            'dígito verificador errado' => ['12ABC34501DE34'],
            'sequência repetida' => ['00000000000000'],
            'curto demais' => ['12ABC34501DE3'],
            'longo demais' => ['12ABC34501DE355'],
            'dv não numérico' => ['12ABC34501DEXX'],
            'caractere inválido' => ['12ABC34501D#35'],
            'vazio' => [''],
        ];
    }
}
