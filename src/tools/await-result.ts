import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import type { ServerOptions } from "../types.js";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";
import { waitForTaskResult } from "./shared.js";

export async function handleAwaitResult(
  args: {
    taskID: string;
    intervalMs?: number;
    timeoutMs?: number;
  },
  taskClient: OomolTaskClient,
  options: ServerOptions
) {
  try {
    const result = await waitForTaskResult(
      taskClient,
      args.taskID,
      args,
      options,
      `Task ${args.taskID}`
    );
    return formatSuccessResponse(result);
  } catch (error) {
    return formatErrorResponse(error);
  }
}
