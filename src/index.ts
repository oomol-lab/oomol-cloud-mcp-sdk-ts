#!/usr/bin/env node

import { OomolMcpServer } from "./server.js";

// 导出主类和类型
export { OomolMcpServer } from "./server.js";
export type { ServerOptions, ToolResponse } from "./types.js";

// CLI 入口（当作为可执行文件运行时）
async function main() {
  const apiKey = process.env.OOMOL_API_KEY;

  if (!apiKey) {
    console.error("Error: OOMOL_API_KEY environment variable is required");
    process.exit(1);
  }

  const server = new OomolMcpServer({
    apiKey,
    baseUrl: process.env.OOMOL_BASE_URL,
    name: process.env.MCP_SERVER_NAME,
    version: process.env.MCP_SERVER_VERSION,
  });

  // 优雅关闭处理
  process.on("SIGINT", async () => {
    console.error("\nShutting down gracefully...");
    await server.close();
    process.exit(0);
  });

  await server.run();
}

// 如果是直接执行（非 import）
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
