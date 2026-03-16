import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ServerOptions } from "../types.js";
import { handleAwaitResult } from "./await-result.js";
import { handleCreateBlockTask } from "./create-block-task.js";
import { handleCreateTask } from "./create-task.js";
import { handleExecuteBlockTask } from "./execute-block-task.js";
import { handleExecuteTask } from "./execute-task.js";
import { handleGetDashboard } from "./get-dashboard.js";
import { handleGetLatestTasks } from "./get-latest-tasks.js";
import { handleGetTask } from "./get-task.js";
import { handleGetTaskResult } from "./get-task-result.js";
import { handleListTasks } from "./list-tasks.js";
import { handlePauseUserQueue } from "./pause-user-queue.js";
import { handleResumeUserQueue } from "./resume-user-queue.js";
import { handleSetTasksPause } from "./set-tasks-pause.js";
import { handleUploadFile } from "./upload-file.js";

export function registerTools(
  mcpServer: McpServer,
  taskClient: OomolTaskClient,
  options: ServerOptions
): void {
  mcpServer.registerTool(
    "create_task",
    {
      description:
        "Create a serverless Cloud Task. packageName/packageVersion can come from tool arguments or server defaults.",
    },
    async (args: any) => handleCreateTask(args, taskClient, options)
  );

  mcpServer.registerTool(
    "execute_task",
    {
      description:
        "Create a serverless Cloud Task, wait for completion, and return the result payload.",
    },
    async (args: any) => handleExecuteTask(args, taskClient, options)
  );

  mcpServer.registerTool(
    "list_tasks",
    {
      description:
        "List the current user's tasks with optional filters such as status, taskType, workloadID, and pagination.",
    },
    async (args: any) => handleListTasks(args ?? {}, taskClient)
  );

  mcpServer.registerTool(
    "get_latest_tasks",
    {
      description:
        "Get the latest task for one or more workloadIDs. workloadIDs accepts a string array or a comma-separated string.",
    },
    async (args: any) => handleGetLatestTasks(args, taskClient)
  );

  mcpServer.registerTool(
    "get_dashboard",
    {
      description: "Get the current user's task dashboard, including limits, queue counts, and pause state.",
    },
    async () => handleGetDashboard(taskClient)
  );

  mcpServer.registerTool(
    "set_tasks_pause",
    {
      description: "Pause or resume the current user's task queue by passing paused=true or paused=false.",
    },
    async (args: any) => handleSetTasksPause(args, taskClient)
  );

  mcpServer.registerTool(
    "pause_user_queue",
    {
      description: "Pause the current user's task queue.",
    },
    async () => handlePauseUserQueue(taskClient)
  );

  mcpServer.registerTool(
    "resume_user_queue",
    {
      description: "Resume the current user's task queue.",
    },
    async () => handleResumeUserQueue(taskClient)
  );

  mcpServer.registerTool(
    "get_task",
    {
      description: "Get detail for a task by taskID.",
    },
    async (args: any) => handleGetTask(args, taskClient)
  );

  mcpServer.registerTool(
    "get_task_result",
    {
      description: "Get the current result state for a task by taskID.",
    },
    async (args: any) => handleGetTaskResult(args, taskClient)
  );

  mcpServer.registerTool(
    "await_result",
    {
      description:
        "Poll a task result until it succeeds or fails. Supports intervalMs and timeoutMs.",
    },
    async (args: any) => handleAwaitResult(args, taskClient, options)
  );

  mcpServer.registerTool(
    "upload_file",
    {
      description:
        "Upload a base64-encoded file to Oomol Cloud storage and return the accessible file URL.",
    },
    async (args: any) => handleUploadFile(args, taskClient)
  );

  // Backward-compatible aliases for MCP clients already using block-oriented tool names.
  mcpServer.registerTool(
    "create_block_task",
    {
      description:
        "Alias of create_task for serverless block tasks. packageName/packageVersion can come from tool arguments or server defaults.",
    },
    async (args: any) => handleCreateBlockTask(args, taskClient, options)
  );

  mcpServer.registerTool(
    "execute_block_task",
    {
      description:
        "Alias of execute_task for serverless block tasks. packageName/packageVersion can come from tool arguments or server defaults.",
    },
    async (args: any) => handleExecuteBlockTask(args, taskClient, options)
  );
}
