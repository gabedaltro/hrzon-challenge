<?php

declare(strict_types=1);

namespace App\UseCases\Shared\Dto;

use BackedEnum;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionProperty;

abstract class DtoAbstract
{
    private const SCALAR_TYPES = ['int', 'float', 'string', 'bool', 'array'];

    /** @var array<string, mixed> */
    private array $provided = [];

    /** @param array<string, mixed> $payload */
    public function __construct(array $payload)
    {
        foreach ($this->publicProperties() as $property) {
            $name = $property->getName();

            if (! array_key_exists($name, $payload)) {
                continue;
            }

            $value = $this->cast($payload[$name], $property->getType());

            $this->{$name} = $value;
            $this->provided[$name] = $value;
        }
    }

    /**
     * Só os campos presentes no payload, prontos para create/update.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return $this->provided;
    }

    public function has(string $key): bool
    {
        return array_key_exists($key, $this->provided);
    }

    /** @return ReflectionProperty[] */
    private function publicProperties(): array
    {
        return (new ReflectionClass($this))->getProperties(ReflectionProperty::IS_PUBLIC);
    }

    private function cast(mixed $value, ?ReflectionNamedType $type): mixed
    {
        if ($value === null || $type === null) {
            return $value;
        }

        $typeName = $type->getName();

        if ((is_string($value) || is_int($value)) && is_subclass_of($typeName, BackedEnum::class)) {
            return $typeName::from($value);
        }

        if ($type->isBuiltin() && in_array($typeName, self::SCALAR_TYPES, true)) {
            settype($value, $typeName);
        }

        return $value;
    }
}
