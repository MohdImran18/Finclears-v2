<?php

namespace App\Http\Controllers\Api;

use App\Contracts\BlogServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class BlogController extends BaseController
{
    public function __construct(
        protected BlogServiceInterface $blogs
    ) {
    }

    /**
     * ---------------------------------------------------------
     * Blog Listing
     * GET /api/v1/blogs
     * ---------------------------------------------------------
     */
    public function index(Request $request): JsonResponse
    {
        try {

            $blogs = $this->blogs->paginate(
                (int) $request->integer('per_page', 10)
            );

            return $this->success([
                'blogs' => BlogResource::collection($blogs),
            ]);

        } catch (Throwable $e) {

            report($e);

            return $this->error(
                'Unable to fetch blogs.',
                500
            );

        }
    }

    /**
     * ---------------------------------------------------------
     * Featured Blogs
     * GET /api/v1/blogs/featured
     * ---------------------------------------------------------
     */
    public function featured(): JsonResponse
    {
        try {

            return $this->success([
                'blogs' => BlogResource::collection(
                    $this->blogs->featured()
                ),
            ]);

        } catch (Throwable $e) {

            report($e);

            return $this->error(
                'Unable to fetch featured blogs.',
                500
            );

        }
    }

    /**
     * ---------------------------------------------------------
     * Blog Categories
     * GET /api/v1/blog-categories
     * ---------------------------------------------------------
     */
    public function categories(): JsonResponse
    {
        try {

            return $this->success([
                'categories' => $this->blogs->categories(),
            ]);

        } catch (Throwable $e) {

            report($e);

            return $this->error(
                'Unable to fetch categories.',
                500
            );

        }
    }

    /**
     * ---------------------------------------------------------
     * Search Blogs
     * GET /api/v1/blogs/search?q=...
     * ---------------------------------------------------------
     */
    public function search(Request $request): JsonResponse
    {
        try {

            $keyword = trim(
                $request->string('q')->toString()
            );

            $blogs = $this->blogs->search(
                $keyword,
                (int) $request->integer('per_page', 10)
            );

            return $this->success([
                'blogs' => BlogResource::collection($blogs),
            ]);

        } catch (Throwable $e) {

            report($e);

            return $this->error(
                'Unable to search blogs.',
                500
            );

        }
    }

    /**
     * ---------------------------------------------------------
     * Blog Details
     * GET /api/v1/blogs/{slug}
     * ---------------------------------------------------------
     */
    public function show(string $slug): JsonResponse
    {
        try {

            $blog = $this->blogs->findBySlug($slug);

            if (!$blog) {
                return $this->error(
                    'Blog not found.',
                    404
                );
            }

            return $this->success([
                'blog' => new BlogResource($blog),
            ]);

        } catch (Throwable $e) {

            report($e);

            return $this->error(
                'Unable to fetch blog.',
                500
            );

        }
    }
}