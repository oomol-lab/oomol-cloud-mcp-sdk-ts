import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { OomolTaskClient } from "oomol-cloud-task-sdk";
import type { ServerOptions } from "./types.js";
import { registerTools } from "./tools/index.js";

export class OomolMcpServer {
  private mcpServer: McpServer;
  readonly taskClient: OomolTaskClient;
  private options: ServerOptions;

  constructor(options: ServerOptions = {}) {
    this.options = {
      ...options,
      apiKey: options.apiKey ?? process.env.OOMOL_API_KEY,
      packageName: options.packageName || process.env.OOMOL_PACKAGE_NAME,
      packageVersion: options.packageVersion || process.env.OOMOL_PACKAGE_VERSION,
    };

    // Initialize Task Client
    this.taskClient = new OomolTaskClient({
      apiKey: this.options.apiKey,
      baseUrl: this.options.baseUrl,
      credentials: this.options.credentials,
      fetch: this.options.fetch,
      defaultHeaders: this.options.defaultHeaders,
    });

    // Initialize MCP Server with high-level API
    this.mcpServer = new McpServer(
      {
        name: this.options.name ?? process.env.MCP_SERVER_NAME ?? "oomol-cloud-task",
        version: this.options.version ?? process.env.MCP_SERVER_VERSION ?? "1.0.0",
      },
      {
        capabilities: {
          tools: {}, // Support tools
        },
      }
    );

    registerTools(this.mcpServer, this.taskClient, this.options);
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
