<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Models\User;

class ForgotPasswordController extends BaseController
{
    /**
     * Send Reset Link
     */
    public function forgotPassword(
        ForgotPasswordRequest $request
    ) {
        $status = Password::sendResetLink(
            $request->validated()
        );

        if ($status !== Password::RESET_LINK_SENT) {

            return $this->error(
                __($status),
                400
            );

        }

        return $this->success(
            null,
            'Password reset link sent successfully.'
        );
    }

    /**
     * Reset Password
     */
    public function resetPassword(
        ResetPasswordRequest $request
    ) {
        $status = Password::reset(

            $request->validated(),

            function (
                User $user,
                string $password
            ) {

                $user->forceFill([

                    'password' => Hash::make($password),

                    'remember_token' => Str::random(60),

                ])->save();

                $user->tokens()->delete();

            }

        );

        if ($status !== Password::PASSWORD_RESET) {

            return $this->error(
                __($status),
                400
            );

        }

        return $this->success(
            null,
            'Password has been reset successfully.'
        );
    }
}