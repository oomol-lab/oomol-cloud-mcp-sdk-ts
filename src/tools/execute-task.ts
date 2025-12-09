import { OomolTaskClient, BackoffStrategy } from "oomol-cloud-task-sdk";
import type { ServerOptions } from "../types.js";

export async function handleExecuteTask(
  args: {
    appletID: string;
    inputValues: Record<string, unknown>;
    webhookUrl?: string;
    metadata?: Record<string, unknown>;
    pollIntervalMs?: number;
    timeoutMs?: number;
  },
  taskClient: OomolTaskClient,
  options: ServerOptions
) {
  try {
    const { taskID, result } = await taskClient.createAndWait(
      {
        appletID: args.appletID,
        inputValues: args.inputValues,
        webhookUrl: args.webhookUrl,
        metadata: args.metadata,
      },
      {
        intervalMs: args.pollIntervalMs ?? 3000,
        timeoutMs: args.timeoutMs,
        backoff: {
          strategy: BackoffStrategy.Exponential,
          maxIntervalMs: options.maxPollIntervalMs ?? 30000,
        },
        onProgress: (progress: number | undefined, status: string) => {
          // 进度日志输出到 stderr（不影响 MCP 协议通信）
          console.error(
            `[Task ${taskID}] status=${status} progress=${progress ?? 0}%`
          );
        },
      }
    );

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              taskID,
              status: result.status,
              resultData: result.resultData,
              error: result.error,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            ...(error as any),
          }
        : error;

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: errorMessage,
              details: errorDetails,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}
