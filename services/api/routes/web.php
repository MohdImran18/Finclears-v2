<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Password Reset
|--------------------------------------------------------------------------
|
| Laravel Password Broker requires the named password.reset route
| when generating the reset email.
|
*/

Route::get('/reset-password/{token}', function (string $token) {
    $email = request('email');

    $frontend = env('FRONTEND_URL', 'http://localhost:3000');

    return redirect(
        $frontend .
        '/auth/reset-password?token=' .
        urlencode($token) .
        '&email=' .
        urlencode($email ?? '')
    );
})->name('password.reset');
