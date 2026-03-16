import type { ListTasksQuery, OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handleListTasks(args: ListTasksQuery, taskClient: OomolTaskClient) {
  try {
    const response = await taskClient.listTasks(args ?? {});
    return formatSuccessResponse(response);
  } catch (error) {
    return formatErrorResponse(error);
  }
}
