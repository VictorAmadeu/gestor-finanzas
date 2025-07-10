<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
         $this->app->singleton(
            \Illuminate\Contracts\Foundation\MaintenanceMode::class,
            fn () => $this->app->make(\Illuminate\Foundation\MaintenanceModeManager::class)->driver()
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}