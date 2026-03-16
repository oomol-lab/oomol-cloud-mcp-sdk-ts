import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import type { ServerOptions } from "../types.js";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";
import { createAwaitOptions, resolveCreateTaskRequest } from "./shared.js";

export async function handleExecuteTask(
  args: {
    blockName: string;
    packageName?: string;
    packageVersion?: string;
    inputValues?: Record<string, unknown>;
    webhookUrl?: string;
    metadata?: Record<string, unknown>;
    type?: "serverless";
    intervalMs?: number;
    timeoutMs?: number;
  },
  taskClient: OomolTaskClient,
  options: ServerOptions
) {
  try {
    const request = resolveCreateTaskRequest(args, options);
    const { taskID, result } = await taskClient.createAndWait(
      request,
      createAwaitOptions(args, options, (progress, status) => {
        console.error(`[Task ${request.blockName}] status=${status} progress=${progress ?? 0}%`);
      })
    );

    return formatSuccessResponse({
      taskID,
      request,
      result,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
}
