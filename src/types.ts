import type { ClientOptions } from "oomol-cloud-task-sdk";

/**
 * MCP Server configuration options
 */
export interface ServerOptions extends ClientOptions {
  /** MCP Server name (optional, defaults to "oomol-cloud-task") */
  name?: string;

  /** MCP Server version (optional, defaults to "1.0.0") */
  version?: string;

  /** Default package name for MCP task tools (optional) */
  packageName?: string;

  /** Default package version for MCP task tools (optional) */
  packageVersion?: string;

  /** Maximum polling interval in milliseconds for MCP wait tools */
  maxPollIntervalMs?: number;
}

/**
 * Tool response content type
 */
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
