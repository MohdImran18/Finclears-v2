/* ==========================================================
 | Pagination
 * ========================================================= */

export interface PaginationMeta {
  current_page: number;

  last_page: number;

  per_page: number;

  total: number;

  from?: number;

  to?: number;

  has_more_pages?: boolean;
}

/* ==========================================================
 | API Response
 * ========================================================= */

export interface ApiResponse<T> {
  success: boolean;

  message: string;

  data: T;
}

/* ==========================================================
 | Paginated Response
 * ========================================================= */

export interface PaginatedResponse<T> {
  data: T[];

  meta: PaginationMeta;
}

/* ==========================================================
 | Select Option
 * ========================================================= */

export interface SelectOption {
  label: string;

  value: string | number;
}

/* ==========================================================
 | Base Filters
 * ========================================================= */

export interface BaseFilters {
  search?: string;

  page?: number;

  per_page?: number;
}

/* ==========================================================
 | Upload Response
 * ========================================================= */

export interface UploadResponse {
  success: boolean;

  message: string;

  data: {
    url: string;

    path: string;

    file_name: string;
  };
}