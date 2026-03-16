import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handleSetTasksPause(
  args: {
    paused: boolean;
  },
  taskClient: OomolTaskClient
) {
  try {
    const response = await taskClient.setTasksPause(args.paused);
    return formatSuccessResponse({
      paused: args.paused,
      ...response,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
}
