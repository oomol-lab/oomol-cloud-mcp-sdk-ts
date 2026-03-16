#!/usr/bin/env node

import { fileURLToPath } from "url";
import { realpathSync } from "fs";
import { OomolMcpServer } from "./server.js";

// Export MCP server plus the full Cloud Task SDK surface.
export { OomolMcpServer } from "./server.js";
export type { ServerOptions, ToolResponse } from "./types.js";
export * from "oomol-cloud-task-sdk";

// CLI entry point (when run as executable)
async function main() {
  const server = new OomolMcpServer({
    apiKey: process.env.OOMOL_API_KEY,
    baseUrl: process.env.OOMOL_BASE_URL,
    name: process.env.MCP_SERVER_NAME,
    version: process.env.MCP_SERVER_VERSION,
    packageName: process.env.OOMOL_PACKAGE_NAME,
    packageVersion: process.env.OOMOL_PACKAGE_VERSION,
  });

  // Graceful shutdown handler
  process.on("SIGINT", async () => {
    console.error("\nShutting down gracefully...");
    await server.close();
    process.exit(0);
  });

  await server.run();
}

// Check if this file is being executed directly (supports symlinks)
const isMainModule = () => {
  if (!process.argv[1]) return false;

  try {
    const scriptPath = fileURLToPath(import.meta.url);
    // Resolve symlink to real path
    const argv1Real = realpathSync(process.argv[1]);

    // Compare real paths
    return scriptPath === argv1Real;
  } catch (error) {
    return false;
  }
};

// Run main function if executed directly (not imported)
if (isMainModule()) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
