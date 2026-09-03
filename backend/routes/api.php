<?php

declare(strict_types=1);

use App\Http\Controllers\Company\CreateCompanyController;
use App\Http\Controllers\Company\DeleteCompanyController;
use App\Http\Controllers\Company\ForceDeleteCompanyController;
use App\Http\Controllers\Company\InactivateCompanyController;
use App\Http\Controllers\Company\ListCompaniesController;
use App\Http\Controllers\Company\ReactivateCompanyController;
use App\Http\Controllers\Company\RestoreCompanyController;
use App\Http\Controllers\Company\SelectableCompaniesController;
use App\Http\Controllers\Company\ShowCompanyController;
use App\Http\Controllers\Company\UpdateCompanyController;
use App\Http\Controllers\Product\CreateProductController;
use App\Http\Controllers\Product\DeleteProductController;
use App\Http\Controllers\Product\ForceDeleteProductController;
use App\Http\Controllers\Product\InactivateProductController;
use App\Http\Controllers\Product\ListProductsController;
use App\Http\Controllers\Product\ReactivateProductController;
use App\Http\Controllers\Product\RestoreProductController;
use App\Http\Controllers\Product\ShowProductController;
use App\Http\Controllers\Product\UpdateProductController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn() => response()->json(['status' => 'ok']));

Route::prefix('companies')->group(function () {
    Route::get('/', ListCompaniesController::class);
    Route::post('/', CreateCompanyController::class);

    Route::get('/selectable', SelectableCompaniesController::class);

    Route::get('/{company}', ShowCompanyController::class)->withTrashed();
    Route::put('/{company}', UpdateCompanyController::class)->withTrashed();
    Route::delete('/{company}', DeleteCompanyController::class)->withTrashed();
    Route::post('/{company}/restore', RestoreCompanyController::class)->withTrashed();
    Route::delete('/{company}/force', ForceDeleteCompanyController::class)->withTrashed();
    Route::post('/{company}/inactivate', InactivateCompanyController::class)->withTrashed();
    Route::post('/{company}/reactivate', ReactivateCompanyController::class)->withTrashed();
});

Route::prefix('products')->group(function () {
    Route::get('/', ListProductsController::class);
    Route::post('/', CreateProductController::class);

    Route::get('/{product}', ShowProductController::class)->withTrashed();
    Route::put('/{product}', UpdateProductController::class)->withTrashed();
    Route::delete('/{product}', DeleteProductController::class)->withTrashed();
    Route::post('/{product}/restore', RestoreProductController::class)->withTrashed();
    Route::delete('/{product}/force', ForceDeleteProductController::class)->withTrashed();
    Route::post('/{product}/inactivate', InactivateProductController::class)->withTrashed();
    Route::post('/{product}/reactivate', ReactivateProductController::class)->withTrashed();
});
