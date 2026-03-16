import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import type { ServerOptions } from "../types.js";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";
import { resolveCreateTaskRequest } from "./shared.js";

export async function handleCreateTask(
  args: {
    blockName: string;
    packageName?: string;
    packageVersion?: string;
    inputValues?: Record<string, unknown>;
    webhookUrl?: string;
    metadata?: Record<string, unknown>;
    type?: "serverless";
  },
  taskClient: OomolTaskClient,
  options: ServerOptions
) {
  try {
    const request = resolveCreateTaskRequest(args, options);
    const response = await taskClient.createTask(request);

    return formatSuccessResponse({
      taskID: response.taskID,
      request,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
}
