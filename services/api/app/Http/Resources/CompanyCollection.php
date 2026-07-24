<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CompanyCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [

            'data'=>CompanyResource::collection(
                $this->collection
            )

        ];
    }

    public function with(Request $request): array
    {
        return [

            'meta'=>[

                'current_page'=>$this->currentPage(),

                'last_page'=>$this->lastPage(),

                'per_page'=>$this->perPage(),

                'total'=>$this->total(),

            ]

        ];
    }
}