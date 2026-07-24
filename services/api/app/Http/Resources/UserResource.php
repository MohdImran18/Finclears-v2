<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'name' => $this->name,

            'email' => $this->email,

            'phone' => $this->phone,

            'avatar' => $this->avatar,

            'role' => $this->role,

            'status' => $this->status,

            'email_verified_at' => optional(
                $this->email_verified_at
            )->toISOString(),

            'last_login_at' => optional(
                $this->last_login_at
            )->toISOString(),

            'created_at' => optional(
                $this->created_at
            )->toISOString(),

            'updated_at' => optional(
                $this->updated_at
            )->toISOString(),

        ];
    }
}