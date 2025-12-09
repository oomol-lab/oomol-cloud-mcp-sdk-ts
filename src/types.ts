/**
 * MCP Server 配置选项
 */
export interface ServerOptions {
  /** Oomol Cloud API Key（必填） */
  apiKey: string;

  /** API Base URL（可选，默认使用 oomol-cloud-task-sdk 的默认值） */
  baseUrl?: string;

  /** MCP Server 名称（可选，默认 "oomol-cloud-task"） */
  name?: string;

  /** MCP Server 版本（可选，默认 "1.0.0"） */
  version?: string;

  /** 自定义 HTTP Headers（可选） */
  defaultHeaders?: Record<string, string>;

  /** 轮询最大间隔时间（毫秒，默认 30000） */
  maxPollIntervalMs?: number;
}

/**
 * Tool 响应内容类型
 */
export interface ToolResponse {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}
