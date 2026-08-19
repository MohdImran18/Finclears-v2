import axios, { AxiosError } from "axios";

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export function getApiError(
  error: unknown,
  fallback = "Something went wrong."
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }

    if (axiosError.response?.data?.errors) {
      const firstError = Object.values(
        axiosError.response.data.errors
      )[0];

      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
    }

    switch (axiosError.response?.status) {
      case 400:
        return "Bad request.";

      case 401:
        return "Unauthorized. Please login again.";

      case 403:
        return "You do not have permission to perform this action.";

      case 404:
        return "Requested resource was not found.";

      case 409:
        return "Conflict detected.";

      case 422:
        return "Validation failed.";

      case 429:
        return "Too many requests. Please try again later.";

      case 500:
        return "Internal server error.";

      default:
        return fallback;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

