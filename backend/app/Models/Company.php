<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\Status;
use App\Rules\Cnpj;
use Database\Factories\CompanyFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $cnpj
 * @property string $email
 * @property string $phone
 * @property Status $status
 * @property Carbon|null $deleted_at
 */
class Company extends Model
{
    /** @use HasFactory<CompanyFactory> */
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['name', 'cnpj', 'email', 'phone', 'status'];

    /** @return HasMany<Product, $this> */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function isActive(): bool
    {
        return $this->status === Status::Active;
    }

    /** Apta a receber vínculo de produto: ativa e não excluída. */
    public function canReceiveProducts(): bool
    {
        return $this->isActive() && $this->deleted_at === null;
    }

    /** Guarda o CNPJ sempre normalizado (sem máscara, maiúsculas). */
    protected function cnpj(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => Cnpj::sanitize($value),
        );
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['status' => Status::class];
    }
}
