<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/*
|--------------------------------------------------------------------------
| Contracts
|--------------------------------------------------------------------------
*/

use App\Contracts\AuthServiceInterface;
use App\Contracts\UserRepositoryInterface;
use App\Contracts\ServiceRepositoryInterface;
use App\Contracts\ServiceServiceInterface;
use App\Contracts\BlogRepositoryInterface;
use App\Contracts\BlogServiceInterface;
use App\Contracts\ContactServiceInterface;
use App\Contracts\NewsletterServiceInterface;

/*
|--------------------------------------------------------------------------
| Repository Contracts
|--------------------------------------------------------------------------
*/

use App\Contracts\Repositories\CompanyRepositoryInterface;
use App\Contracts\Repositories\ItrReturnRepositoryInterface;

use App\Contracts\Repositories\AssessmentYearRepositoryInterface;
use App\Contracts\Repositories\FinancialYearRepositoryInterface;
use App\Contracts\Repositories\ItrTypeRepositoryInterface;
use App\Contracts\Repositories\TaxRegimeRepositoryInterface;
use App\Contracts\Repositories\ReturnStatusRepositoryInterface;

/*
|--------------------------------------------------------------------------
| Services
|--------------------------------------------------------------------------
*/

use App\Services\Auth\AuthService;
use App\Services\Service\ServiceService;
use App\Services\Blog\BlogService;
use App\Services\ContactService;
use App\Services\NewsletterService;

/*
|--------------------------------------------------------------------------
| Repositories
|--------------------------------------------------------------------------
*/

use App\Repositories\UserRepository;
use App\Repositories\ServiceRepository;
use App\Repositories\BlogRepository;
use App\Repositories\CompanyRepository;
use App\Repositories\ItrReturnRepository;

use App\Repositories\AssessmentYearRepository;
use App\Repositories\FinancialYearRepository;
use App\Repositories\ItrTypeRepository;
use App\Repositories\TaxRegimeRepository;
use App\Repositories\ReturnStatusRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register application services.
     */
    public function register(): void
    {
        $this->registerRepositories();
        $this->registerServices();
    }

    /**
     * Bootstrap application services.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Repository Bindings
     */
    private function registerRepositories(): void
{
    $this->app->bind(
        UserRepositoryInterface::class,
        UserRepository::class
    );

    $this->app->bind(
        CompanyRepositoryInterface::class,
        CompanyRepository::class
    );

    $this->app->bind(
        ItrReturnRepositoryInterface::class,
        ItrReturnRepository::class
    );

    $this->app->bind(
        AssessmentYearRepositoryInterface::class,
        AssessmentYearRepository::class
    );

    $this->app->bind(
        FinancialYearRepositoryInterface::class,
        FinancialYearRepository::class
    );

    $this->app->bind(
        ItrTypeRepositoryInterface::class,
        ItrTypeRepository::class
    );

    $this->app->bind(
        TaxRegimeRepositoryInterface::class,
        TaxRegimeRepository::class
    );

    $this->app->bind(
        ReturnStatusRepositoryInterface::class,
        ReturnStatusRepository::class
    );

    $this->app->bind(
        ServiceRepositoryInterface::class,
        ServiceRepository::class
    );

    $this->app->bind(
        BlogRepositoryInterface::class,
        BlogRepository::class
    );
}

    /**
     * Service Bindings
     */
    private function registerServices(): void
    {
        $this->app->bind(
            AuthServiceInterface::class,
            AuthService::class
        );

        $this->app->bind(
            ServiceServiceInterface::class,
            ServiceService::class
        );

        $this->app->bind(
            BlogServiceInterface::class,
            BlogService::class
        );

        $this->app->bind(
            ContactServiceInterface::class,
            ContactService::class
        );

        $this->app->bind(
            NewsletterServiceInterface::class,
            NewsletterService::class
        );
    }
}
