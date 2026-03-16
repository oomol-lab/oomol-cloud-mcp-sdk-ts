import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handleGetTaskResult(
  args: {
    taskID: string;
  },
  taskClient: OomolTaskClient
) {
  try {
    const response = await taskClient.getTaskResult(args.taskID);
    return formatSuccessResponse(response);
  } catch (error) {
    return formatErrorResponse(error);
  }
}
