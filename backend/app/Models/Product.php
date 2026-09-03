<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Status;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $company_id
 * @property string $name
 * @property string|null $description
 * @property string $price
 * @property string $internal_code
 * @property Status $status
 * @property bool $deleted_via_company
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read Company $company
 */
class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    use SoftDeletes;

    // deleted_via_company fora do fillable de propósito: só os services alteram.
    protected $fillable = ['company_id', 'name', 'description', 'price', 'internal_code', 'status'];

    /** @return BelongsTo<Company, $this> */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function isActive(): bool
    {
        return $this->status === Status::Active;
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'status' => Status::class,
            'price' => 'decimal:2',
            'deleted_via_company' => 'boolean',
        ];
    }
}
