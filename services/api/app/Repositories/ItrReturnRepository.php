<?php

namespace App\Repositories;

use App\Contracts\Repositories\ItrReturnRepositoryInterface;
use App\Models\ItrReturn;
use App\Models\ReturnStatus;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ItrReturnRepository extends BaseRepository implements ItrReturnRepositoryInterface
{
    public function __construct(
        ItrReturn $model
    ) {
        $this->model = $model;
    }

    /**
     * Find by UUID
     */
    public function findByUuid(
        string $uuid
    ): ?ItrReturn {

        return $this->model
            ->where('uuid', $uuid)
            ->first();
    }

    /**
     * User Returns
     */
    public function getUserReturns(
        int $userId
    ): LengthAwarePaginator {

        return $this->model
            ->where('user_id', $userId)
            ->latest()
            ->paginate(15);
    }

    /**
     * Draft Returns
     */
    public function getDraftReturns(): LengthAwarePaginator
    {
        $draft = ReturnStatus::where(
            'code',
            'draft'
        )->first();

        return $this->model
            ->where(
                'return_status_id',
                optional($draft)->id
            )
            ->latest()
            ->paginate(15);
    }

    /**
     * Submitted Returns
     */
    public function getSubmittedReturns(): LengthAwarePaginator
    {
        $submitted = ReturnStatus::where(
            'code',
            'submitted'
        )->first();

        return $this->model
            ->where(
                'return_status_id',
                optional($submitted)->id
            )
            ->latest()
            ->paginate(15);
    }

    /**
     * Assessment Year Returns
     */
    public function getByAssessmentYear(
        string $assessmentYear
    ): LengthAwarePaginator {

        return $this->model
            ->whereHas(
                'assessmentYear',
                function ($query) use (
                    $assessmentYear
                ) {
                    $query->where(
                        'name',
                        $assessmentYear
                    );
                }
            )
            ->latest()
            ->paginate(15);
    }
}