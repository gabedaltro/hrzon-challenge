# Hrzon — Sistema de Gerenciamento de Produtos e Fornecedores

Cadastro e manutenção de **Empresas (Fornecedores)** e seus **Produtos**, com status
operacional (Ativo/Inativo), exclusão lógica com restauração e exclusão física
quando permitida. Sem autenticação.

## Stack

| Camada | Tecnologia |
|---|---|
| Back-end | Laravel 11 · PHP 8.2 · MySQL/MariaDB |
| Front-end | React 18 · Vite 5 · TypeScript · Material UI 5 |

## Estrutura do repositório

```
hrzon/
├── backend/    API REST em Laravel
└── frontend/   SPA em React
```ss

---

## Back-end

### Requisitos

- PHP 8.2+ (`pdo_mysql`)
- Composer 2
- MySQL 8 ou MariaDB 10.4+

### Como rodar

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Ajuste as credenciais em `.env` (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) e crie
os bancos:

```sql
CREATE DATABASE hrzon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE hrzon_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
php artisan migrate --seed
php artisan serve      # http://localhost:8000
```

O seed cria uma massa de exemplo cobrindo todos os estados: empresas ativas,
inativas (com produtos inativos) e excluída logicamente (com produtos excluídos em
cascata), além de produtos em estados individuais.

**CORS**: liberado para `api/*` a partir da origem em `FRONTEND_URL` no `.env`
(padrão `http://localhost:5173`, o dev server do Vite).

### Testes

```bash
composer test     # php artisan test  — 57 testes
composer lint     # ./vendor/bin/pint — padronização (preset Laravel)
```

Os testes rodam contra o banco `hrzon_test` (configurado em `phpunit.xml`), isolado
do banco de desenvolvimento.

### Estrutura de pastas

```
backend/app/
├── Enums/Status.php               Ativo / Inativo
├── Exceptions/
│   └── BusinessRuleException.php  Recusa por regra de negócio (status HTTP + msg ao usuário)
├── Http/Controllers/
│   ├── Company/                   Um controller de ação única por endpoint
│   └── Product/
├── Models/                        Company, Product
├── Rules/
│   ├── Cnpj.php                   CNPJ alfanumérico (dígitos verificadores)
│   └── CompanyLinkable.php        Empresa existe, ativa e não excluída
└── UseCases/
    ├── Shared/
    │   ├── Dto/DtoAbstract.php               Hidrata o DTO a partir do payload validado
    │   └── Validation/ValidatorAbstract.php  Base das classes de validação
    └── {Company,Product}/
        ├── Cases/       Caso de uso (regra de negócio, transações)
        ├── DTO/         Entrada tipada
        ├── Validation/  Regras de validação (server-side)
        └── Output/      Formatação da resposta
```

Fluxo de uma requisição: **Controller** valida o payload com um **Validator** e monta
um **DTO** → **UseCase** aplica a regra de negócio → **Output** formata a resposta.

Toda resposta com corpo usa envelope: `{ "data": ... }` para um registro,
`{ "data": [...], "meta": { current_page, last_page, per_page, total } }` para listas.
Cada empresa no `data` traz um bloco `permissions` (`update`, `inactivate`,
`reactivate`, `delete`, `restore`, `force_delete`) para o front só oferecer ações
que a regra vai aceitar.

### API — Empresas

| Método | Rota | Ação |
|---|---|---|
| `GET` | `/api/companies` | Listar. Filtros: `name`, `status` (`active`/`inactive`), `trashed` (`without` padrão / `with` / `only`), `page`, `per_page`. Ordenação: `order_by` (`name` padrão, `cnpj`, `email`, `phone`, `products_count`, `status`, `created_at`) e `direction` (`asc`/`desc`). |
| `POST` | `/api/companies` | Criar. |
| `GET` | `/api/companies/{id}` | Ver (resolve mesmo se excluída). |
| `PUT` | `/api/companies/{id}` | Editar dados (não altera status). |
| `DELETE` | `/api/companies/{id}` | Excluir logicamente (cascata para produtos). |
| `POST` | `/api/companies/{id}/restore` | Restaurar (restaura só os produtos que caíram junto). |
| `DELETE` | `/api/companies/{id}/force` | Excluir definitivamente (só se já excluída e sem produtos). |
| `POST` | `/api/companies/{id}/inactivate` | Inativar (produtos ficam inativos). |
| `POST` | `/api/companies/{id}/reactivate` | Reativar (sem cascata). |
| `GET` | `/api/companies/selectable` | Empresas aptas a receber produto (ativas, não excluídas). Filtro `name`. |

O CNPJ é aceito com ou sem máscara e o telefone com ou sem formatação; ambos são
normalizados antes da validação (o `unique` do CNPJ compara já sem máscara).

### API — Produtos

| Método | Rota | Ação |
|---|---|---|
| `GET` | `/api/products` | Listar. Filtros: `name`, `status`, `company_id`, `trashed`, `page`, `per_page`. Ordenação: `order_by` (`name` padrão, `internal_code`, `company`, `price`, `status`, `created_at`) e `direction`. |
| `POST` | `/api/products` | Criar (empresa precisa estar ativa e não excluída). |
| `GET` | `/api/products/{id}` | Ver. |
| `PUT` | `/api/products/{id}` | Editar dados e vínculo de empresa (não altera status). |
| `DELETE` | `/api/products/{id}` | Excluir logicamente (individual). |
| `POST` | `/api/products/{id}/restore` | Restaurar (bloqueado se a empresa não estiver apta ou o código interno já estiver em uso). |
| `DELETE` | `/api/products/{id}/force` | Excluir definitivamente (só se já excluído). |
| `POST` | `/api/products/{id}/inactivate` | Inativar. |
| `POST` | `/api/products/{id}/reactivate` | Reativar (bloqueado se a empresa estiver inativa/excluída). |

Decisões: `price` aceita 0–2 casas decimais e é armazenado com 2; o vínculo de
empresa **pode** ser trocado na edição, desde que a nova empresa esteja apta; o
código interno é único por empresa **entre os produtos vivos** — pode ser
reaproveitado após exclusão lógica, e a restauração é barrada se isso gerar conflito.

### Modelagem

O sistema trabalha com **duas dimensões independentes**:

| Dimensão | Coluna | Significado |
|---|---|---|
| Status operacional | `status` (`active` / `inactive`) | O registro existe e aparece nas listagens, mas não pode receber novas operações quando inativo. |
| Exclusão lógica | `deleted_at` (soft delete) | Fora das listagens por padrão; acessível só por filtro explícito; restaurável. |

Um registro pode estar em qualquer combinação das duas (ativo e excluído, inativo e
excluído, etc.).

**Empresa → Produtos** é 1:N. Regras de cascata:

- Inativar empresa → produtos ficam inativos automaticamente.
- Reativar empresa → produtos **não** voltam sozinhos (ação individual).
- Excluir empresa logicamente → produtos são excluídos junto; os já excluídos antes
  não são tocados.
- Restaurar empresa → volta só os produtos excluídos junto com ela. Isso é rastreado
  pela flag `products.deleted_via_company`, escrita apenas pelas operações de
  excluir/restaurar empresa.
- Exclusão física de empresa é proibida se houver qualquer produto vinculado, mesmo
  excluído logicamente (reforçado no banco por `ON DELETE RESTRICT`).
- Exclusão definitiva só para registros já excluídos logicamente.

**Unicidade:**

- `companies.cnpj` — único considerando também registros excluídos (índice `unique`
  simples). Armazenado sem máscara, em maiúsculas. Formato **alfanumérico** (padrão
  da Receita Federal: 12 caracteres alfanuméricos + 2 dígitos verificadores).
- `companies.email` — mesmo critério.
- `products` — `unique (company_id, internal_code, deleted_at)`: código interno único
  por empresa entre os registros vivos; `deleted_at` no índice permite reaproveitar
  um código depois de uma exclusão lógica.

### Respostas de erro

Erros em rotas `api/*` sempre retornam JSON, em português:

```jsonc
// 422 — validação
{ "message": "Os dados informados são inválidos.", "errors": { "campo": ["..."] } }

// 422 / 409 — regra de negócio
{ "message": "Não é possível excluir uma empresa que possui produtos vinculados." }

// 404
{ "message": "Registro não encontrado." }
```

### Exemplos

```bash
# Criar empresa (CNPJ e telefone com ou sem máscara)
curl -X POST http://localhost:8000/api/companies \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"name":"Alpha Distribuidora","cnpj":"12.ABC.345/01DE-35","email":"contato@alpha.com","phone":"(11) 98765-4321"}'
```

```jsonc
// 201
{
  "data": {
    "id": 1,
    "name": "Alpha Distribuidora",
    "cnpj": "12ABC34501DE35",
    "cnpj_formatted": "12.ABC.345/01DE-35",
    "email": "contato@alpha.com",
    "phone": "11987654321",
    "status": "active",
    "status_label": "Ativo",
    "is_active": true,
    "is_trashed": false,
    "products_count": 0,
    "permissions": {
      "update": true, "inactivate": true, "reactivate": false,
      "delete": true, "restore": false, "force_delete": false
    }
  }
}
```

```bash
# Criar produto vinculado a uma empresa apta
curl -X POST http://localhost:8000/api/products \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d '{"company_id":1,"name":"Cabo HDMI 2m","price":"29.9","internal_code":"SKU-001"}'
```

---

## Front-end

SPA em React que consome a API. Duas áreas — **Empresas** e **Produtos** — cada uma com
listagem filtrável, cadastro, edição e as ações de estado (inativar, reativar, excluir,
restaurar, excluir definitivamente).

### Requisitos

- Node 20+
- Yarn

### Como rodar

```bash
cd frontend
yarn install
yarn dev          # http://localhost:5173
```

O endereço da API fica em `VITE_API_URL` (`.env.development`, padrão
`http://localhost:8000/api`). O back-end precisa estar no ar; o CORS já libera a origem
`http://localhost:5173`.

```bash
yarn build     # tsc + build de produção em dist/
yarn lint      # ESLint com Prettier
```

### Estrutura de pastas

```
frontend/src/
├── components/     Componentes compartilhados (tabela, filtros, diálogos, máscaras, feedback)
├── config/theme.ts Tema do Material UI com a identidade Horizon
├── helpers/        Formatação e validação puras (CNPJ, telefone, moeda, erros da API)
├── hooks/          Contextos e hooks de app, mensageria, modo de exibição e busca de empresas
├── pages/
│   ├── companies/  Listagem, ações e cadastro de empresas
│   ├── products/   Listagem, ações e cadastro de produtos
│   └── error/
├── routes/         Rotas e o Router ligado ao history
├── services/       Instância do axios e o history compartilhado
└── types/          Tipos dos recursos da API
```

Cada página segue o mesmo desenho:

```
pages/<recurso>/
├── <Recurso>.tsx              Monta a página e liga os pedaços
├── <Recurso>FilterBox.tsx     Filtros da listagem
├── template/                  Colunas da tabela
├── hooks/                     Busca paginada, contexto e execução das ações
├── actions/                   Textos das confirmações, chamadas à API e menu de ações
├── list/table/                Visão em tabela
├── list/module/               Visão em cards
└── registration/              Formulário, validação e as telas de novo e edição
```

### Decisões

**As ações vêm do servidor.** Cada registro chega com um bloco `permissions`, e o menu de
ações monta só o que está liberado ali. Um produto de empresa inativa não mostra "Reativar";
uma empresa excluída que ainda tem produtos não mostra "Excluir definitivamente". A interface
não recalcula a regra — ela obedece à resposta da API, então não existe ação que o servidor
vá recusar depois.

**As duas dimensões aparecem juntas.** A coluna Situação mostra o status operacional e, quando
é o caso, também o selo de excluído — um registro pode estar ativo e excluído ao mesmo tempo.
Linhas de registros excluídos entram com menos peso visual.

**Toda confirmação diz o que vai acontecer.** Inativar uma empresa avisa quantos produtos
ficam inativos junto; excluir avisa quantos são excluídos em cascata; reativar lembra que os
produtos não voltam sozinhos; a exclusão definitiva é a única com aviso de irreversível e
botão vermelho.

**Validação nos dois lados, sem duplicar a verdade.** O formulário valida com yup para apontar
o erro no campo e devolver o foco antes de gastar uma ida à API — incluindo o dígito
verificador do CNPJ alfanumérico. Quando o servidor recusa (CNPJ ou e-mail duplicado, código
interno repetido na empresa), a mensagem dele é aplicada no campo correspondente.

**Paginação, filtros e ordenação no servidor.** A listagem manda `name`, `status`, `trashed`,
`company_id`, `order_by`, `direction`, `page` e `per_page` para a API e usa o `meta` da resposta;
o filtro por nome tem espera antes de disparar. Nada é filtrado nem ordenado em memória — ordenar
uma página já paginada daria uma ordem que só vale para as linhas visíveis. Clicar no cabeçalho
alterna asc/desc e volta para a primeira página; as colunas aceitas são uma lista fechada no
servidor, e a de produtos por empresa ordena pelo nome da empresa vinculada.

**Sem estado global.** O que existe de compartilhado é a mensageria (snackbar) e a largura da
janela. O resto vive na página que usa, em contextos locais.

**Identidade visual.** O amarelo `#FBE509` é a cor de ação (botões primários, indicador do menu),
sempre com texto preto e nunca como texto sobre branco; o cabeçalho é grafite `#141414` com o
logotipo aplicado sem distorção nem recoloração. A listagem vira cards abaixo de 960px, o menu
vira drawer no mobile, e o foco de teclado tem contorno visível.

---

## Status do projeto

- [x] **Etapa 1** — Fundação: ambiente, arquitetura base, tratamento de erros,
  modelagem (migrations + models).
- [x] **Etapa 2** — Validação de CNPJ alfanumérico (`App\Rules\Cnpj`), factories e
  seeder com massa de exemplo.
- [x] **Etapa 3** — CRUD de Empresas: 9 endpoints, casos de uso, regras de status e
  exclusão lógica/física com cascata; testes de feature.
- [x] **Etapa 4** — CRUD de Produtos: 9 endpoints + empresas selecionáveis, regras de
  vínculo, reativação e restauração condicionadas ao estado da empresa; testes.
- [x] **Etapa 5** — Cobertura de testes ampliada (57 testes / 180 asserções): guardas
  de estado, cascatas, paginação, flags de `permissions`, formato de erro, CORS.
- [x] **Etapa 6** — Front-end: listagens com filtros e paginação da API, ações guiadas
  pelo bloco `permissions`, confirmações com o impacto de cada operação, formulários com
  validação de campo e identidade visual Horizon.
