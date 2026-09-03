<?php

declare(strict_types=1);

use App\Exceptions\BusinessRuleException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport(BusinessRuleException::class);

        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return match (true) {
                $e instanceof ValidationException => response()->json([
                    'message' => 'Os dados informados são inválidos.',
                    'errors' => $e->errors(),
                ], $e->status),

                $e instanceof BusinessRuleException => response()->json([
                    'message' => $e->getMessage(),
                ], $e->status()),

                $e instanceof ModelNotFoundException,
                $e instanceof NotFoundHttpException => response()->json([
                    'message' => 'Registro não encontrado.',
                ], 404),

                $e instanceof AuthorizationException => response()->json([
                    'message' => 'Ação não permitida.',
                ], 403),

                $e instanceof HttpExceptionInterface => response()->json([
                    'message' => $e->getMessage() ?: 'Não foi possível processar a requisição.',
                ], $e->getStatusCode()),

                default => response()->json([
                    'message' => config('app.debug')
                        ? $e->getMessage()
                        : 'Erro interno no servidor.',
                ], 500),
            };
        });
    })->create();
