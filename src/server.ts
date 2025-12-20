import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { OomolTaskClient } from "oomol-cloud-task-sdk";
import { handleListApplets } from "./tools/list-applets.js";
import { handleExecuteTask } from "./tools/execute-task.js";
import { handleCreateTask } from "./tools/create-task.js";
import type { ServerOptions } from "./types.js";

export class OomolMcpServer {
  private mcpServer: McpServer;
  private taskClient: OomolTaskClient;
  private options: ServerOptions;

  constructor(options: ServerOptions) {
    this.options = options;

    // Initialize Task Client
    this.taskClient = new OomolTaskClient({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      defaultHeaders: options.defaultHeaders,
    });

    // Initialize MCP Server with high-level API
    this.mcpServer = new McpServer(
      {
        name: options.name ?? "oomol-cloud-task",
        version: options.version ?? "1.0.0",
      },
      {
        capabilities: {
          tools: {}, // Support tools
        },
      }
    );

    // Register all tools
    this.registerTools();
  }

  /**
   * Register all tools using the underlying Server API for better control
   */
  private registerTools(): void {
    // Register list_applets tool
    this.mcpServer.registerTool(
      "list_applets",
      {
        description:
          "List all available Oomol Cloud API applets with their IDs, titles, and descriptions",
      },
      async (args: any) => {
        return await handleListApplets(args, this.taskClient, this.options);
      }
    );

    // Register execute_task tool
    this.mcpServer.registerTool(
      "execute_task",
      {
        description:
          "Create and execute an Oomol Cloud task, wait for completion, and return the result",
      },
      async (args: any) => {
        return await handleExecuteTask(args, this.taskClient, this.options);
      }
    );

    // Register create_task tool
    this.mcpServer.registerTool(
      "create_task",
      {
        description:
          "Create an Oomol Cloud task without waiting for completion (use webhook for async notification)",
      },
      async (args: any) => {
        return await handleCreateTask(args, this.taskClient);
      }
    );
  }

  /**
   * Start Server (connect Stdio Transport)
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.mcpServer.connect(transport);

    console.error("Oomol Cloud MCP Server started on stdio");
  }

  /**
   * Graceful shutdown
   */
  async close(): Promise<void> {
    await this.mcpServer.close();
  }
}
