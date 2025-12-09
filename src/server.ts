import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { OomolTaskClient } from "oomol-cloud-task-sdk";
import { registerTools } from "./tools/index.js";
import type { ServerOptions } from "./types.js";

export class OomolMcpServer {
  private mcpServer: Server;
  private taskClient: OomolTaskClient;

  constructor(options: ServerOptions) {
    // 初始化 Task Client
    this.taskClient = new OomolTaskClient({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      defaultHeaders: options.defaultHeaders,
    });

    // 初始化 MCP Server
    this.mcpServer = new Server(
      {
        name: options.name ?? "oomol-cloud-task",
        version: options.version ?? "1.0.0",
      },
      {
        capabilities: {
          tools: {}, // 支持 tools
        },
      }
    );

    // 注册所有 Tools
    registerTools(this.mcpServer, this.taskClient, options);

    // 注册 tools/list handler
    this.mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "list_applets",
            description:
              "List all available Oomol Cloud API applets with their IDs, titles, and descriptions",
            inputSchema: {
              type: "object",
              properties: {
                limit: {
                  type: "number",
                  description:
                    "Maximum number of applets to return (1-100, default: unlimited)",
                  minimum: 1,
                  maximum: 100,
                },
                skip: {
                  type: "number",
                  description: "Number of applets to skip for pagination (default: 0)",
                  minimum: 0,
                  default: 0,
                },
              },
            },
          },
          {
            name: "execute_task",
            description:
              "Create and execute an Oomol Cloud task, wait for completion, and return the result",
            inputSchema: {
              type: "object",
              properties: {
                appletID: {
                  type: "string",
                  description: "Applet ID to execute",
                },
                inputValues: {
                  type: "object",
                  description: "Input parameters for the applet",
                },
                webhookUrl: {
                  type: "string",
                  description:
                    "Optional webhook URL for completion notification",
                },
                metadata: {
                  type: "object",
                  description: "Optional metadata",
                },
                pollIntervalMs: {
                  type: "number",
                  description: "Polling interval in milliseconds (default: 3000)",
                  default: 3000,
                },
                timeoutMs: {
                  type: "number",
                  description: "Maximum wait time in milliseconds",
                },
              },
              required: ["appletID", "inputValues"],
            },
          },
          {
            name: "create_task",
            description:
              "Create an Oomol Cloud task without waiting for completion (use webhook for async notification)",
            inputSchema: {
              type: "object",
              properties: {
                appletID: {
                  type: "string",
                  description: "Applet ID to execute",
                },
                inputValues: {
                  type: "object",
                  description: "Input parameters for the applet",
                },
                webhookUrl: {
                  type: "string",
                  description:
                    "Optional webhook URL for completion notification",
                },
                metadata: {
                  type: "object",
                  description: "Optional metadata",
                },
              },
              required: ["appletID", "inputValues"],
            },
          },
        ],
      };
    });
  }

  /**
   * 启动 Server（连接 Stdio Transport）
   */
  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.mcpServer.connect(transport);

    console.error("Oomol Cloud MCP Server started on stdio");
  }

  /**
   * 优雅关闭
   */
  async close(): Promise<void> {
    await this.mcpServer.close();
  }
}
