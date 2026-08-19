<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cashfree Payment Gateway
    |--------------------------------------------------------------------------
    */

    'cashfree' => [
        'app_id' => env('CASHFREE_APP_ID'),

        'secret_key' => env('CASHFREE_SECRET_KEY'),

        'environment' => env(
            'CASHFREE_ENV',
            'sandbox'
        ),

        

        'api_version' => env(
            'CASHFREE_API_VERSION',
            '2025-01-01'
        ),

        'base_url' => env(
            'CASHFREE_BASE_URL',
            'https://sandbox.cashfree.com/pg'
        ),

        'company_return_url' => env(
            'CASHFREE_COMPANY_RETURN_URL',
            'http://127.0.0.1:8000/api/v1/company-payments/cashfree/return'
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Sandbox APIs
    |--------------------------------------------------------------------------
    | Income Tax / KYC / PAN / Aadhaar / GST integrations
    |--------------------------------------------------------------------------
    */

    'sandbox' => [
    'base_url' => env(
        'SANDBOX_BASE_URL',
        'https://test-api.sandbox.co.in'
    ),

    'api_key' => env('SANDBOX_API_KEY'),

    'api_secret' => env('SANDBOX_API_SECRET'),

    'itr_filing_endpoint' => env(
    'SANDBOX_ITR_FILING_ENDPOINT'
     ),

    'itr_filing_enabled' => filter_var(
        env('SANDBOX_ITR_FILING_ENABLED', false),
        FILTER_VALIDATE_BOOL
    ),

    'auth_api_version' => env(
        'SANDBOX_AUTH_API_VERSION',
        '1.0.0'
    ),

    'api_version' => env(
        'SANDBOX_API_VERSION',
        '1.0'
    ),
],
];