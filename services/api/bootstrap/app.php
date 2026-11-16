<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Spatie\Permission\Middleware\RoleMiddleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Middleware\RoleOrPermissionMiddleware;

return Application::configure(
    basePath: dirname(__DIR__)
)
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    ->withBroadcasting(__DIR__.'/../routes/channels.php', [
        'middleware' => ['api', 'auth:sanctum'],
    ])
    ->withMiddleware(function (
        Middleware $middleware
    ): void {

        $middleware->redirectGuestsTo(
            fn (Request $request) =>
                $request->is('api/*')
                    ? null
                    : '/login'
        );

        $middleware->alias([
          'role' => RoleMiddleware::class,
'permission' => PermissionMiddleware::class,
'role_or_permission' => RoleOrPermissionMiddleware::class,
'require_permission' => \App\Http\Middleware\RequirePermission::class,
'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'lead.ownership' => \App\Http\Middleware\EnsureLeadOwnership::class,
            'employee.consent.token' => \App\Http\Middleware\RequireEmployeeConsentToken::class,
            'employee.consent' => \App\Http\Middleware\RequireEmployeeDailyConsent::class,
        ]);
    })

    ->withExceptions(function (
        Exceptions $exceptions
    ): void {

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*')
        );
    })

    ->create();
