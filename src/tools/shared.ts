import { BackoffStrategy } from "oomol-cloud-task-sdk";
import type {
  AwaitOptions,
  CreateTaskRequest,
  OomolTaskClient,
} from "oomol-cloud-task-sdk";
import type { ServerOptions } from "../types.js";
import { resolvePackageConfig } from "../utils/package-config.js";

export interface AwaitTaskArgs {
  intervalMs?: number;
  timeoutMs?: number;
}

export type CreateTaskArgs = Omit<CreateTaskRequest, "packageName" | "packageVersion"> & {
  packageName?: string;
  packageVersion?: string;
};

export function resolveCreateTaskRequest(
  args: CreateTaskArgs,
  options: ServerOptions
): CreateTaskRequest {
  const { packageName, packageVersion } = resolvePackageConfig(args, options);

  return {
    type: args.type ?? "serverless",
    blockName: args.blockName,
    packageName,
    packageVersion,
    inputValues: args.inputValues,
    webhookUrl: args.webhookUrl,
    metadata: args.metadata,
  };
}

export function createAwaitOptions(
  args: AwaitTaskArgs,
  options: ServerOptions,
  onProgress?: AwaitOptions["onProgress"]
): AwaitOptions {
  return {
    intervalMs: args.intervalMs,
    timeoutMs: args.timeoutMs,
    onProgress,
    backoff: {
      strategy: BackoffStrategy.Exponential,
      maxIntervalMs: options.maxPollIntervalMs ?? 3000,
    },
  };
}

export async function waitForTaskResult(
  taskClient: OomolTaskClient,
  taskID: string,
  args: AwaitTaskArgs,
  options: ServerOptions,
  label: string
) {
  return taskClient.awaitResult(
    taskID,
    createAwaitOptions(args, options, (progress, status) => {
      console.error(`[${label}] status=${status} progress=${progress ?? 0}%`);
    })
  );
}
