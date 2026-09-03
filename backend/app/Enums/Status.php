<?php

declare(strict_types=1);

namespace App\Enums;

/** Estado operacional (Ativo/Inativo), independente da exclusão lógica. */
enum Status: string
{
    case Active = 'active';
    case Inactive = 'inactive';

    /** @return string[] */
    public static function values(): array
    {
        return array_map(fn (self $status) => $status->value, self::cases());
    }

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Ativo',
            self::Inactive => 'Inativo',
        };
    }
}
