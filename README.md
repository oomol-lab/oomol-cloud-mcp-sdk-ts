# oomol-cloud-mcp-sdk

MCP server SDK for Oomol Cloud Task API v3. This package now aligns with [`oomol-cloud-task-sdk`](https://www.npmjs.com/package/oomol-cloud-task-sdk): it re-exports the full Cloud Task TypeScript SDK surface and adds MCP server support on top.

**English** | [简体中文](README.zh-CN.md)

## Features

- Full MCP server support based on `@modelcontextprotocol/sdk`
- Re-exports the full `oomol-cloud-task-sdk` API, types, and errors
- Uses the same serverless task model as the Cloud Task TS SDK
- Provides MCP tools for task creation, execution, querying, queue control, and upload
- Keeps backward-compatible aliases for `create_block_task` and `execute_block_task`

## Installation

```bash
npm install oomol-cloud-mcp-sdk
```

## Quick Start

### Run as an MCP server

```bash
export OOMOL_API_KEY="your-api-key"
oomol-mcp-server
```

If you want MCP task tools to default to a package, also set:

```bash
export OOMOL_PACKAGE_NAME="@oomol/your-package"
export OOMOL_PACKAGE_VERSION="1.0.0"
```

### Configure an MCP client

```json
{
  "mcpServers": {
    "oomol-cloud": {
      "command": "npx",
      "args": ["-y", "oomol-cloud-mcp-sdk"],
      "env": {
        "OOMOL_API_KEY": "your-api-key-here",
        "OOMOL_PACKAGE_NAME": "@oomol/your-package",
        "OOMOL_PACKAGE_VERSION": "1.0.0"
      }
    }
  }
}
```

## Programmatic Usage

### Use it as the Cloud Task TS SDK

```ts
import { OomolTaskClient } from "oomol-cloud-mcp-sdk";

const client = new OomolTaskClient({
  apiKey: process.env.OOMOL_API_KEY,
});

const { taskID, result } = await client.createAndWait({
  packageName: "@oomol/my-package",
  packageVersion: "1.0.0",
  blockName: "main",
  inputValues: { text: "hello" },
});
```

### Run the MCP server programmatically

```ts
import { OomolMcpServer } from "oomol-cloud-mcp-sdk";

const server = new OomolMcpServer({
  apiKey: process.env.OOMOL_API_KEY,
  packageName: process.env.OOMOL_PACKAGE_NAME,
  packageVersion: process.env.OOMOL_PACKAGE_VERSION,
});

await server.run();
```

`server.taskClient` exposes the underlying `OomolTaskClient` instance.

## MCP Tools

Core tools aligned with the Cloud Task TS SDK:

- `create_task`
- `execute_task`
- `list_tasks`
- `get_latest_tasks`
- `get_task`
- `get_task_result`
- `await_result`
- `get_dashboard`
- `set_tasks_pause`
- `pause_user_queue`
- `resume_user_queue`
- `upload_file`

Backward-compatible aliases:

- `create_block_task` -> `create_task`
- `execute_block_task` -> `execute_task`

### `create_task`

Uses the same request shape as `OomolTaskClient.createTask()`, with optional `packageName` and `packageVersion` defaults from server config.

```json
{
  "name": "create_task",
  "arguments": {
    "blockName": "main",
    "inputValues": {
      "text": "hello"
    }
  }
}
```

### `execute_task`

Uses the same task payload as `create_task`, plus polling controls:

```json
{
  "name": "execute_task",
  "arguments": {
    "blockName": "main",
    "inputValues": {
      "text": "hello"
    },
    "intervalMs": 2000,
    "timeoutMs": 300000
  }
}
```

### Query and control tools

- `list_tasks` accepts the same filters as `listTasks(query?)`
- `get_latest_tasks` accepts `workloadIDs: string[] | string`
- `await_result` accepts `taskID`, `intervalMs`, and `timeoutMs`
- `set_tasks_pause` accepts `{ "paused": true | false }`

### `upload_file`

Accepts a base64-encoded file payload:

```json
{
  "name": "upload_file",
  "arguments": {
    "fileName": "example.txt",
    "fileData": "SGVsbG8gd29ybGQ=",
    "mimeType": "text/plain"
  }
}
```

## Exports

This package exports:

- `OomolMcpServer`
- `ServerOptions`
- `ToolResponse`
- Everything from `oomol-cloud-task-sdk`

That includes `OomolTaskClient`, all Cloud Task types, `BackoffStrategy`, and error classes such as `ApiError`, `TaskFailedError`, `TimeoutError`, and `UploadError`.

## Configuration

### Environment variables

| Variable | Description | Required |
| --- | --- | --- |
| `OOMOL_API_KEY` | Oomol Cloud API key, typically required for MCP server usage in Node.js | Usually |
| `OOMOL_BASE_URL` | Cloud Task API base URL | No |
| `OOMOL_PACKAGE_NAME` | Default package name for MCP task tools | No |
| `OOMOL_PACKAGE_VERSION` | Default package version for MCP task tools | No |
| `MCP_SERVER_NAME` | MCP server name | No |
| `MCP_SERVER_VERSION` | MCP server version | No |

### `ServerOptions`

`ServerOptions` extends `ClientOptions` from `oomol-cloud-task-sdk` and adds:

```ts
interface ServerOptions extends ClientOptions {
  name?: string;
  version?: string;
  packageName?: string;
  packageVersion?: string;
  maxPollIntervalMs?: number;
}
```

## Development

```bash
npm install
npm run build
```

## License

MIT
