import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handlePauseUserQueue(taskClient: OomolTaskClient) {
  try {
    const response = await taskClient.pauseUserQueue();
    return formatSuccessResponse(response);
  } catch (error) {
    return formatErrorResponse(error);
  }
}
