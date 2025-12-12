import type { ToolResponse } from "../types.js";

/**
 * Format success response
 */
export function formatSuccessResponse(data: unknown): ToolResponse {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Format error response
 */
export function formatErrorResponse(error: unknown): ToolResponse {
  let errorMessage = "Unknown error";
  let errorDetails: unknown;

  if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = {
      name: error.name,
      message: error.message,
      ...(error as any), // Include extra fields (e.g. ApiError status)
    };
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            error: errorMessage,
            details: errorDetails,
          },
          null,
          2
        ),
      },
    ],
    isError: true,
  };
}
