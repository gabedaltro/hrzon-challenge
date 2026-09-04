<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\Status;
use App\Models\Company;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<string, mixed> */
    private function payload(Company $company, array $overrides = []): array
    {
        return array_merge([
            'company_id' => $company->id,
            'name' => 'Cabo HDMI 2m',
            'description' => 'Cabo de alta velocidade',
            'price' => '29.90',
            'internal_code' => 'SKU-001',
        ], $overrides);
    }

    public function test_listing_excludes_trashed_and_filters_by_company_and_status(): void
    {
        $a = Company::factory()->create();
        $b = Company::factory()->create();
        Product::factory()->count(2)->for($a)->create();
        Product::factory()->for($a)->inactive()->create();
        Product::factory()->for($b)->create();
        Product::factory()->for($a)->trashed()->create();

        $this->getJson("/api/products?company_id={$a->id}")
            ->assertOk()->assertJsonPath('meta.total', 3);

        $this->getJson("/api/products?company_id={$a->id}&status=inactive")
            ->assertOk()->assertJsonPath('meta.total', 1);
    }

    public function test_listing_can_be_sorted_by_company_name_and_by_price(): void
    {
        $alpha = Company::factory()->create(['name' => 'Alpha Distribuidora']);
        $zeta = Company::factory()->create(['name' => 'Zeta Distribuidora']);

        Product::factory()->for($zeta)->create(['name' => 'Cabo', 'price' => '10.00']);
        Product::factory()->for($alpha)->create(['name' => 'Mouse', 'price' => '90.00']);

        $this->getJson('/api/products?order_by=company&direction=asc')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Mouse');

        $this->getJson('/api/products?order_by=company&direction=desc')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Cabo');

        $this->getJson('/api/products?order_by=price&direction=desc')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Mouse');
    }

    public function test_listing_rejects_an_unknown_sort_column(): void
    {
        $this->getJson('/api/products?order_by=company_id')
            ->assertStatus(422)
            ->assertJsonValidationErrors('order_by');
    }

    public function test_creates_product_for_an_active_company(): void
    {
        $company = Company::factory()->create();

        $this->postJson('/api/products', $this->payload($company))
            ->assertCreated()
            ->assertJsonPath('data.status', 'active')
            ->assertJsonPath('data.company.id', $company->id);

        $this->assertDatabaseHas('products', [
            'company_id' => $company->id,
            'internal_code' => 'SKU-001',
            'deleted_via_company' => false,
        ]);
    }

    public function test_cannot_create_product_without_company(): void
    {
        $this->postJson('/api/products', [
            'name' => 'Sem empresa',
            'price' => '10.00',
            'internal_code' => 'X1',
        ])->assertStatus(422)->assertJsonValidationErrors('company_id');
    }

    public function test_cannot_create_product_for_inactive_or_trashed_company(): void
    {
        $inactive = Company::factory()->inactive()->create();
        $trashed = Company::factory()->trashed()->create();

        $this->postJson('/api/products', $this->payload($inactive))
            ->assertStatus(422)->assertJsonValidationErrors('company_id');

        $this->postJson('/api/products', $this->payload($trashed))
            ->assertStatus(422)->assertJsonValidationErrors('company_id');
    }

    public function test_internal_code_is_unique_per_company_only(): void
    {
        $a = Company::factory()->create();
        $b = Company::factory()->create();
        Product::factory()->for($a)->create(['internal_code' => 'SKU-1']);

        $this->postJson('/api/products', $this->payload($a, ['internal_code' => 'SKU-1']))
            ->assertStatus(422)->assertJsonValidationErrors('internal_code');

        $this->postJson('/api/products', $this->payload($b, ['internal_code' => 'SKU-1']))
            ->assertCreated();
    }

    public function test_internal_code_can_be_reused_after_soft_delete(): void
    {
        $company = Company::factory()->create();
        Product::factory()->for($company)->trashed()->create(['internal_code' => 'SKU-1']);

        $this->postJson('/api/products', $this->payload($company, ['internal_code' => 'SKU-1']))
            ->assertCreated();
    }

    public function test_rejects_price_zero_or_negative(): void
    {
        $company = Company::factory()->create();

        $this->postJson('/api/products', $this->payload($company, ['price' => '0']))
            ->assertStatus(422)->assertJsonValidationErrors('price');

        $this->postJson('/api/products', $this->payload($company, ['price' => '-5.00']))
            ->assertStatus(422)->assertJsonValidationErrors('price');
    }

    public function test_update_changes_data_but_never_status(): void
    {
        $product = Product::factory()->inactive()->create();

        $this->putJson("/api/products/{$product->id}", $this->payload($product->company, [
            'name' => 'Nome Novo',
            'status' => 'active',
        ]))->assertOk()->assertJsonPath('data.name', 'Nome Novo');

        $this->assertSame(Status::Inactive, $product->refresh()->status);
    }

    public function test_cannot_move_product_to_inactive_company_on_update(): void
    {
        $product = Product::factory()->create();
        $inactive = Company::factory()->inactive()->create();

        $this->putJson("/api/products/{$product->id}", $this->payload($inactive))
            ->assertStatus(422)->assertJsonValidationErrors('company_id');
    }

    public function test_cannot_update_a_trashed_product(): void
    {
        $product = Product::factory()->trashed()->create();

        $this->putJson("/api/products/{$product->id}", $this->payload($product->company))
            ->assertStatus(422)
            ->assertJsonPath('message', 'Não é possível editar um produto excluído.');
    }

    public function test_cannot_reactivate_product_when_company_is_inactive(): void
    {
        $company = Company::factory()->inactive()->create();
        $product = Product::factory()->for($company)->inactive()->create();

        $this->postJson("/api/products/{$product->id}/reactivate")
            ->assertStatus(422)
            ->assertJsonPath('message', 'Não é possível ativar um produto cuja empresa está inativa ou excluída.');
    }

    public function test_individual_delete_keeps_flag_false_and_force_delete_needs_trashed_first(): void
    {
        $product = Product::factory()->create();

        $this->deleteJson("/api/products/{$product->id}/force")->assertStatus(422);

        $this->deleteJson("/api/products/{$product->id}")->assertOk();
        $this->assertSoftDeleted($product);
        $this->assertFalse($product->refresh()->deleted_via_company);

        $this->deleteJson("/api/products/{$product->id}/force")->assertNoContent();
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_restore_product_blocked_when_company_not_linkable(): void
    {
        $company = Company::factory()->create();
        $product = Product::factory()->for($company)->create();
        $this->deleteJson("/api/products/{$product->id}")->assertOk();

        $company->update(['status' => Status::Inactive]);

        $this->postJson("/api/products/{$product->id}/restore")
            ->assertStatus(422)
            ->assertJsonPath('message', 'Não é possível restaurar um produto cuja empresa está inativa ou excluída.');
    }

    public function test_restore_product_conflicts_with_a_live_code(): void
    {
        $company = Company::factory()->create();
        $product = Product::factory()->for($company)->create(['internal_code' => 'SKU-1']);
        $this->deleteJson("/api/products/{$product->id}")->assertOk();

        Product::factory()->for($company)->create(['internal_code' => 'SKU-1']);

        $this->postJson("/api/products/{$product->id}/restore")->assertStatus(409);
    }

    public function test_restore_product_succeeds_when_company_is_active_and_no_conflict(): void
    {
        $product = Product::factory()->create();
        $this->deleteJson("/api/products/{$product->id}")->assertOk();

        $this->postJson("/api/products/{$product->id}/restore")->assertOk();
        $this->assertNotSoftDeleted($product);
    }

    public function test_selectable_companies_returns_only_active_and_not_trashed(): void
    {
        Company::factory()->create(['name' => 'Alpha']);
        Company::factory()->inactive()->create(['name' => 'Beta']);
        Company::factory()->trashed()->create(['name' => 'Gama']);

        $response = $this->getJson('/api/companies/selectable');

        $response->assertOk()->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Alpha');
    }

    public function test_selectable_companies_filters_by_name(): void
    {
        Company::factory()->create(['name' => 'Alpha Distribuidora']);
        Company::factory()->create(['name' => 'Beta Atacado']);

        $this->getJson('/api/companies/selectable?name=alpha')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Alpha Distribuidora');
    }

    public function test_state_guards_reject_no_op_actions(): void
    {
        $active = Product::factory()->create();
        $this->postJson("/api/products/{$active->id}/reactivate")->assertStatus(422);

        $inactive = Product::factory()->inactive()->create();
        $this->postJson("/api/products/{$inactive->id}/inactivate")->assertStatus(422);

        $trashed = Product::factory()->trashed()->create();
        $this->deleteJson("/api/products/{$trashed->id}")->assertStatus(422);
    }

    public function test_reactivate_product_succeeds_when_company_is_active(): void
    {
        $product = Product::factory()->inactive()->create();

        $this->postJson("/api/products/{$product->id}/reactivate")
            ->assertOk()
            ->assertJsonPath('data.status', 'active');
    }

    public function test_output_exposes_company_and_permission_flags(): void
    {
        $product = Product::factory()->create();

        $this->getJson("/api/products/{$product->id}")
            ->assertJsonPath('data.company.id', $product->company_id)
            ->assertJsonPath('data.permissions.update', true)
            ->assertJsonPath('data.permissions.restore', false)
            ->assertJsonPath('data.permissions.force_delete', false);
    }
}
