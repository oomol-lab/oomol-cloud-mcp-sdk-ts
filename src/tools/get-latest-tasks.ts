import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handleGetLatestTasks(
  args: {
    workloadIDs: string[] | string;
  },
  taskClient: OomolTaskClient
) {
  try {
    const response = await taskClient.getLatestTasks(args.workloadIDs);
    return formatSuccessResponse(response);
  } catch (error) {
    return formatErrorResponse(error);
  }
}
