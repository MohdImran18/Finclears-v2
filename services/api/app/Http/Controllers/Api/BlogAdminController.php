<?php

namespace App\Http\Controllers\Api;

use App\Contracts\BlogServiceInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\PatchBlogRequest;
use App\Http\Requests\Blog\StoreBlogRequest;
use App\Http\Requests\Blog\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogAdminController extends BaseController
{
    public function __construct(
        protected BlogServiceInterface $blogs
    ) {
    }

    /**
     * Admin Blog List
     *
     * GET /api/v1/admin/blogs
     */
    public function index(Request $request): JsonResponse
    {
        $blogs = $this->blogs->adminPaginate(
            (int) $request->get('per_page', 15),
            $request->filled('search')
                ? $request->string('search')->toString()
                : null,
            $request->has('status')
                ? $request->boolean('status')
                : null,
            $request->has('featured')
                ? $request->boolean('featured')
                : null
        );

        return $this->success([
            'blogs' => BlogResource::collection($blogs),
        ]);
    }

    /**
     * Admin Blog Details
     *
     * GET /api/v1/admin/blogs/{blog}
     */
    public function show(int $blog): JsonResponse
    {
        $item = $this->blogs->find($blog);

        if (!$item) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        return $this->success([
            'blog' => new BlogResource($item),
        ]);
    }

    /**
     * Create Blog
     *
     * POST /api/v1/admin/blogs
     */
    public function store(
        StoreBlogRequest $request
    ): JsonResponse {
        $blog = $this->blogs->create(
            $request->validated()
        );

        return $this->success(
            [
                'blog' => new BlogResource($blog),
            ],
            'Blog created successfully.',
            201
        );
    }

    /**
     * Full Update Blog
     *
     * PUT /api/v1/admin/blogs/{blog}
     */
    public function update(
        UpdateBlogRequest $request,
        int $blog
    ): JsonResponse {
        $existing = $this->blogs->find($blog);

        if (!$existing) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        $updated = $this->blogs->update(
            $blog,
            $request->validated()
        );

        return $this->success(
            [
                'blog' => new BlogResource($updated),
            ],
            'Blog updated successfully.'
        );
    }

    /**
     * Partial Update Blog
     *
     * PATCH /api/v1/admin/blogs/{blog}
     */
    public function patch(
        PatchBlogRequest $request,
        int $blog
    ): JsonResponse {
        $existing = $this->blogs->find($blog);

        if (!$existing) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        $updated = $this->blogs->update(
            $blog,
            $request->validated()
        );

        return $this->success(
            [
                'blog' => new BlogResource($updated),
            ],
            'Blog updated successfully.'
        );
    }

    /**
     * Publish Blog
     *
     * POST /api/v1/admin/blogs/{blog}/publish
     */
    public function publish(int $blog): JsonResponse
    {
        $existing = $this->blogs->find($blog);

        if (!$existing) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        $updated = $this->blogs->update(
            $blog,
            [
                'status' => true,
                'published_at' => $existing->published_at ?? now(),
            ]
        );

        return $this->success(
            [
                'blog' => new BlogResource($updated),
            ],
            'Blog published successfully.'
        );
    }

    /**
     * Unpublish Blog
     *
     * POST /api/v1/admin/blogs/{blog}/unpublish
     */
    public function unpublish(int $blog): JsonResponse
    {
        $existing = $this->blogs->find($blog);

        if (!$existing) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        $updated = $this->blogs->update(
            $blog,
            [
                'status' => false,
            ]
        );

        return $this->success(
            [
                'blog' => new BlogResource($updated),
            ],
            'Blog unpublished successfully.'
        );
    }

    /**
     * Feature Blog
     *
     * POST /api/v1/admin/blogs/{blog}/feature
     */
    public function feature(int $blog): JsonResponse
    {
        $existing = $this->blogs->find($blog);

        if (!$existing) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        $updated = $this->blogs->update(
            $blog,
            [
                'is_featured' => true,
            ]
        );

        return $this->success(
            [
                'blog' => new BlogResource($updated),
            ],
            'Blog featured successfully.'
        );
    }

    /**
     * Unfeature Blog
     *
     * POST /api/v1/admin/blogs/{blog}/unfeature
     */
    public function unfeature(int $blog): JsonResponse
    {
        $existing = $this->blogs->find($blog);

        if (!$existing) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        $updated = $this->blogs->update(
            $blog,
            [
                'is_featured' => false,
            ]
        );

        return $this->success(
            [
                'blog' => new BlogResource($updated),
            ],
            'Blog unfeatured successfully.'
        );
    }

    /**
     * Delete Blog
     *
     * DELETE /api/v1/admin/blogs/{blog}
     */
    public function destroy(int $blog): JsonResponse
    {
        $existing = $this->blogs->find($blog);

        if (!$existing) {
            return $this->error(
                'Blog not found.',
                404
            );
        }

        $this->blogs->delete($blog);

        return $this->success(
            [],
            'Blog deleted successfully.'
        );
    }
}