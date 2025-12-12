/**
 * MCP Server configuration options
 */
export interface ServerOptions {
  /** Oomol Cloud API Key (required) */
  apiKey: string;

  /** API Base URL (optional, defaults to oomol-cloud-task-sdk default) */
  baseUrl?: string;

  /** MCP Server name (optional, defaults to "oomol-cloud-task") */
  name?: string;

  /** MCP Server version (optional, defaults to "1.0.0") */
  version?: string;

  /** Custom HTTP Headers (optional) */
  defaultHeaders?: Record<string, string>;

  /** Maximum polling interval in milliseconds (default: 30000) */
  maxPollIntervalMs?: number;
}

/**
 * Tool response content type
 */
export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
