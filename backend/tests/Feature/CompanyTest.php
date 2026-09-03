<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\Status;
use App\Models\Company;
use App\Models\Product;
use App\Rules\Cnpj;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyTest extends TestCase
{
    use RefreshDatabase;

    /** @return array<string, mixed> */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Fornecedor Alpha',
            'cnpj' => Cnpj::complete('12ABC34501DE'),
            'email' => 'contato@alpha.com',
            'phone' => '11987654321',
        ], $overrides);
    }

    public function test_listing_excludes_trashed_by_default_and_paginates(): void
    {
        Company::factory(3)->create();
        Company::factory()->trashed()->create();

        $response = $this->getJson('/api/companies');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('meta.total', 3);
    }

    public function test_listing_can_filter_by_name_status_and_trashed(): void
    {
        Company::factory()->create(['name' => 'Padaria Central', 'status' => Status::Active]);
        Company::factory()->create(['name' => 'Padaria Sul', 'status' => Status::Inactive]);
        Company::factory()->trashed()->create(['name' => 'Padaria Norte']);

        $this->getJson('/api/companies?name=Padaria&status=inactive')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Padaria Sul');

        $this->getJson('/api/companies?trashed=only')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Padaria Norte');
    }

    public function test_creates_company_and_stores_normalised_cnpj(): void
    {
        $response = $this->postJson('/api/companies', $this->validPayload([
            'cnpj' => '12.ABC.345/01DE-35',
        ]));

        $response->assertCreated()
            ->assertJsonPath('data.cnpj', '12ABC34501DE35')
            ->assertJsonPath('data.status', 'active');

        $this->assertDatabaseHas('companies', ['cnpj' => '12ABC34501DE35']);
    }

    public function test_rejects_duplicate_cnpj_even_when_the_other_is_trashed(): void
    {
        $cnpj = Cnpj::complete('12ABC34501DE');
        Company::factory()->trashed()->create(['cnpj' => $cnpj]);

        $this->postJson('/api/companies', $this->validPayload(['cnpj' => $cnpj]))
            ->assertStatus(422)
            ->assertJsonValidationErrors('cnpj');
    }

    public function test_rejects_invalid_cnpj_and_phone_without_ddd(): void
    {
        $this->postJson('/api/companies', $this->validPayload(['cnpj' => '12ABC34501DE34']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('cnpj');

        $this->postJson('/api/companies', $this->validPayload(['phone' => '98765432']))
            ->assertStatus(422)
            ->assertJsonValidationErrors('phone');
    }

    public function test_update_changes_data_but_never_status(): void
    {
        $company = Company::factory()->create(['status' => Status::Active]);

        $this->putJson("/api/companies/{$company->id}", $this->validPayload([
            'name' => 'Novo Nome',
            'status' => 'inactive',
        ]))->assertOk()->assertJsonPath('data.name', 'Novo Nome');

        $this->assertSame(Status::Active, $company->refresh()->status);
    }

    public function test_cannot_update_a_trashed_company(): void
    {
        $company = Company::factory()->trashed()->create();

        $this->putJson("/api/companies/{$company->id}", $this->validPayload())
            ->assertStatus(422)
            ->assertJsonPath('message', 'Não é possível editar uma empresa excluída.');
    }

    public function test_inactivating_company_inactivates_all_its_products(): void
    {
        $company = Company::factory()
            ->has(Product::factory()->count(2))
            ->create();

        $this->postJson("/api/companies/{$company->id}/inactivate")->assertOk();

        $this->assertSame(Status::Inactive, $company->refresh()->status);
        $company->products->each(
            fn (Product $p) => $this->assertSame(Status::Inactive, $p->refresh()->status)
        );
    }

    public function test_reactivating_company_does_not_reactivate_products(): void
    {
        $company = Company::factory()->inactive()
            ->has(Product::factory()->count(2)->inactive())
            ->create();

        $this->postJson("/api/companies/{$company->id}/reactivate")->assertOk();

        $this->assertSame(Status::Active, $company->refresh()->status);
        $company->products->each(
            fn (Product $p) => $this->assertSame(Status::Inactive, $p->refresh()->status)
        );
    }

    public function test_soft_deleting_company_cascades_only_to_live_products(): void
    {
        $company = Company::factory()->create();
        $live = Product::factory()->for($company)->create();
        $alreadyGone = Product::factory()->trashed()->for($company)->create();

        $this->deleteJson("/api/companies/{$company->id}")->assertOk();

        $this->assertSoftDeleted($company);
        $this->assertSoftDeleted($live);
        $this->assertTrue($live->refresh()->deleted_via_company);
        $this->assertFalse($alreadyGone->refresh()->deleted_via_company);
    }

    public function test_restoring_company_restores_only_the_cascade_deleted_products(): void
    {
        $company = Company::factory()->create();
        $live = Product::factory()->for($company)->create();
        $alreadyGone = Product::factory()->trashed()->for($company)->create();

        $this->deleteJson("/api/companies/{$company->id}")->assertOk();
        $this->postJson("/api/companies/{$company->id}/restore")->assertOk();

        $this->assertNotSoftDeleted($company);
        $this->assertNotSoftDeleted($live);
        $this->assertFalse($live->refresh()->deleted_via_company);
        $this->assertSoftDeleted($alreadyGone);
    }

    public function test_cannot_force_delete_a_company_that_has_products(): void
    {
        $company = Company::factory()->has(Product::factory())->create();
        $this->deleteJson("/api/companies/{$company->id}")->assertOk();

        $this->deleteJson("/api/companies/{$company->id}/force")
            ->assertStatus(409);

        $this->assertDatabaseHas('companies', ['id' => $company->id]);
    }

    public function test_force_delete_only_works_after_soft_delete(): void
    {
        $company = Company::factory()->create();

        $this->deleteJson("/api/companies/{$company->id}/force")
            ->assertStatus(422);

        $this->deleteJson("/api/companies/{$company->id}")->assertOk();
        $this->deleteJson("/api/companies/{$company->id}/force")->assertNoContent();

        $this->assertDatabaseMissing('companies', ['id' => $company->id]);
    }

    public function test_inactivating_company_also_inactivates_already_trashed_products(): void
    {
        $company = Company::factory()->create();
        $live = Product::factory()->for($company)->create();
        $trashed = Product::factory()->for($company)->trashed()->create();

        $this->postJson("/api/companies/{$company->id}/inactivate")->assertOk();

        $this->assertSame(Status::Inactive, $live->refresh()->status);
        $this->assertSame(Status::Inactive, $trashed->refresh()->status);
    }

    public function test_state_guards_reject_no_op_actions(): void
    {
        $inactive = Company::factory()->inactive()->create();
        $this->postJson("/api/companies/{$inactive->id}/inactivate")->assertStatus(422);

        $active = Company::factory()->create();
        $this->postJson("/api/companies/{$active->id}/reactivate")->assertStatus(422);

        $trashed = Company::factory()->trashed()->create();
        $this->deleteJson("/api/companies/{$trashed->id}")->assertStatus(422);
        $this->postJson("/api/companies/{$active->id}/restore")->assertStatus(422);
    }

    public function test_pagination_meta_reflects_pages(): void
    {
        Company::factory(25)->create();

        $this->getJson('/api/companies?per_page=10&page=2')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.last_page', 3)
            ->assertJsonPath('meta.total', 25);
    }

    public function test_output_permissions_reflect_state(): void
    {
        $withProducts = Company::factory()->has(Product::factory())->create();
        $this->deleteJson("/api/companies/{$withProducts->id}")->assertOk();

        $this->getJson("/api/companies/{$withProducts->id}")
            ->assertJsonPath('data.permissions.restore', true)
            ->assertJsonPath('data.permissions.force_delete', false)
            ->assertJsonPath('data.permissions.update', false);

        $empty = Company::factory()->trashed()->create();
        $this->getJson("/api/companies/{$empty->id}")
            ->assertJsonPath('data.permissions.force_delete', true);
    }

    public function test_missing_company_returns_json_404(): void
    {
        $this->getJson('/api/companies/999999')
            ->assertStatus(404)
            ->assertJsonPath('message', 'Registro não encontrado.');
    }

    public function test_validation_errors_are_field_scoped_and_in_portuguese(): void
    {
        $response = $this->postJson('/api/companies', ['name' => 'ab'])
            ->assertStatus(422)
            ->assertJsonPath('message', 'Os dados informados são inválidos.')
            ->assertJsonValidationErrors(['name', 'cnpj', 'email', 'phone']);

        $this->assertStringContainsString('nome', $response->json('errors.name.0'));
    }
}
