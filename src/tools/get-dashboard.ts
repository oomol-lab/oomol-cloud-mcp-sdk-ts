import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handleGetDashboard(taskClient: OomolTaskClient) {
  try {
    const response = await taskClient.getDashboard();
    return formatSuccessResponse(response);
  } catch (error) {
    return formatErrorResponse(error);
  }
}
