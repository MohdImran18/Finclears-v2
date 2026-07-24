<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\FAQController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UserController;

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Health Check
    |--------------------------------------------------------------------------
    */

    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'message' => 'API is running.',
            'timestamp' => now()->toDateTimeString(),
        ]);
    });

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    Route::prefix('auth')->group(function () {

        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
        Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

        Route::middleware('auth:sanctum')->group(function () {

            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);

        });

    });



    /*
|--------------------------------------------------------------------------
| Newsletter
|--------------------------------------------------------------------------
*/

Route::post(
    '/newsletter/subscribe',
    [NewsletterController::class, 'subscribe']
);

Route::get(
    '/newsletters',
    [NewsletterController::class, 'index']
);

Route::get(
    '/newsletters/{newsletter}',
    [NewsletterController::class, 'show']
);

Route::get(
    "documents/{document}/timeline",
    [DocumentController::class, "timeline"]
);

Route::delete(
    '/newsletters/{newsletter}',
    [NewsletterController::class, 'destroy']
);

    /*
    |--------------------------------------------------------------------------
    | Contact
    |--------------------------------------------------------------------------
    */

    // Public Contact Form
    Route::post('/contact', [ContactController::class, 'store']);

    // Admin Contact Management
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/contacts/{contact}', [ContactController::class, 'show']);
        Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

    });

    /*
    |--------------------------------------------------------------------------
    | Services
    |--------------------------------------------------------------------------
    */

    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/featured', [ServiceController::class, 'featured']);
    Route::get('/services/categories', [ServiceController::class, 'categories']);
    Route::get('/services/search', [ServiceController::class, 'search']);
    Route::get('/services/{slug}', [ServiceController::class, 'show']);

    /*
    |--------------------------------------------------------------------------
    | Blogs
    |--------------------------------------------------------------------------
    */

    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/featured', [BlogController::class, 'featured']);
    Route::get('/blogs/categories', [BlogController::class, 'categories']);
    Route::get('/blogs/search', [BlogController::class, 'search']);
    Route::get('/blogs/{slug}', [BlogController::class, 'show']);


    

});