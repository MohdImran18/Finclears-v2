<?php

if (! function_exists('money')) {

    function money($value): string
    {
        return number_format((float)$value, 2);
    }

}

if (! function_exists('percentage')) {

    function percentage($value): string
    {
        return number_format((float)$value, 2).' %';
    }

}

if (! function_exists('mask_pan')) {

    function mask_pan(string $pan): string
    {
        return substr($pan,0,3)
            .'XXXXX'
            .substr($pan,-2);
    }

}

if (! function_exists('mask_aadhaar')) {

    function mask_aadhaar(string $aadhaar): string
    {
        return 'XXXX XXXX '.substr($aadhaar,-4);
    }

}