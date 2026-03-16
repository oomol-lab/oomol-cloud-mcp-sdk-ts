import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handleGetTask(
  args: {
    taskID: string;
  },
  taskClient: OomolTaskClient
) {
  try {
    const response = await taskClient.getTask(args.taskID);
    return formatSuccessResponse(response);
  } catch (error) {
    return formatErrorResponse(error);
  }
}
