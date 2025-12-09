import { OomolMcpServer } from "../src/index.js";

async function main() {
  const apiKey = process.env.OOMOL_API_KEY;

  if (!apiKey) {
    console.error("Error: OOMOL_API_KEY environment variable is required");
    process.exit(1);
  }

  const server = new OomolMcpServer({
    apiKey,
    name: "my-oomol-server",
    version: "1.0.0",
  });

  console.error("Starting Oomol MCP Server...");
  await server.run();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
