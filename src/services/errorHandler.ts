import { ApiError } from "./api"

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input."
      case 404:
        return "Resource not found."
      case 500:
        return "Server error. Please try again later."
      default:
        return error.message || "An unexpected error occurred."
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred."
}
