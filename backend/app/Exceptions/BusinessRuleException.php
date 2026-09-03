<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * Recusa em razão da regra de negócio
 */
class BusinessRuleException extends RuntimeException
{
    public function __construct(
        string $message,
        private readonly int $status = 422,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, 0, $previous);
    }

    public function status(): int
    {
        return $this->status;
    }

    public static function conflict(string $message): self
    {
        return new self($message, 409);
    }
}
