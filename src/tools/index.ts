import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { OomolTaskClient } from "oomol-cloud-task-sdk";
import { handleExecuteTask } from "./execute-task.js";
import { handleCreateTask } from "./create-task.js";
import { handleListApplets } from "./list-applets.js";
import type { ServerOptions } from "../types.js";

export function registerTools(
  server: Server,
  taskClient: OomolTaskClient,
  options: ServerOptions
): void {
  // Register unified CallToolRequestSchema handler for all tools
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const toolName = request.params.name;

    switch (toolName) {
      case "list_applets":
        return handleListApplets(
          request.params.arguments as any,
          taskClient,
          options
        );

      case "execute_task":
        return handleExecuteTask(
          request.params.arguments as any,
          taskClient,
          options
        );

      case "create_task":
        return handleCreateTask(
          request.params.arguments as any,
          taskClient
        );

      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  });
}

