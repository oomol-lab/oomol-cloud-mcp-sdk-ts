# oomol-cloud-mcp-sdk

MCP Server SDK for Oomol Cloud Task API - Wrap Oomol Cloud task execution capabilities into tools compliant with the [Model Context Protocol](https://modelcontextprotocol.io).

**English** | [简体中文](README.zh-CN.md)

## Features

- ✅ **Full MCP Protocol Support**: Built on official `@modelcontextprotocol/sdk`
- ✅ **Stdio Transport**: Compatible with Cherry Studio, VSCode, Claude Desktop and other MCP clients
- ✅ **Type-Safe**: Complete TypeScript type definitions
- ✅ **Zero Business Logic Duplication**: Fully reuses `oomol-cloud-task-sdk`
- ✅ **Simple API**: 3 core tools covering main use cases

## Installation

Global installation:

```bash
npm install -g oomol-cloud-mcp-sdk
```

Or as a project dependency:

```bash
npm install oomol-cloud-mcp-sdk
```

## Quick Start

### 1. Run as MCP Server

Set environment variable and start the server:

```bash
export OOMOL_API_KEY="your-api-key"
oomol-mcp-server
```

### 2. Configure in MCP Client

#### Cherry Studio / Claude Desktop

Add to MCP configuration file:

```json
{
  "mcpServers": {
    "oomol-cloud": {
      "command": "npx",
      "args": ["-y", "oomol-cloud-mcp-sdk"],
      "env": {
        "OOMOL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### VSCode

Add the same configuration to VSCode MCP settings.

### 3. Use Tools

After configuration, you can use the following tools in MCP Client:

#### `list_applets` - List Available Applets

Get a list of all available Oomol Cloud API applets:

```json
{
  "name": "list_applets",
  "arguments": {
    "limit": 10,
    "skip": 0
  }
}
```

**Response**:
```json
[
  {
    "appletID": "abc-123",
    "title": "Image Processing API",
    "description": "Cloud function for image processing",
    "enabled": true,
    "packageId": "image-processor-1.0.0",
    "blockName": "processImage",
    "presetInputs": {
      "quality": 80
    },
    "createdAt": "2024-12-09T12:00:00.000Z"
  }
]
```

#### `execute_task` - Execute Task and Wait for Result

Create and execute a task, waiting for completion:

```json
{
  "name": "execute_task",
  "arguments": {
    "appletID": "your-applet-id",
    "inputValues": {
      "input_param1": "value1",
      "input_param2": "value2"
    },
    "pollIntervalMs": 2000,
    "timeoutMs": 300000
  }
}
```

**Response**:
```json
{
  "taskID": "task-uuid",
  "status": "success",
  "resultData": {
    "output": "..."
  }
}
```

#### `create_task` - Create Task Only (No Wait)

Create a task without waiting for results:

```json
{
  "name": "create_task",
  "arguments": {
    "appletID": "your-applet-id",
    "inputValues": {
      "input_param1": "value1"
    },
    "webhookUrl": "https://your-webhook.com/callback"
  }
}
```

**Response**:
```json
{
  "taskID": "task-uuid"
}
```

## Programmatic Usage

You can also import and use in code:

```typescript
import { OomolMcpServer } from "oomol-cloud-mcp-sdk";

const server = new OomolMcpServer({
  apiKey: "your-api-key",
  name: "my-server",
  version: "1.0.0",
});

await server.run();
```

## Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OOMOL_API_KEY` | Oomol Cloud API Key | Yes |
| `OOMOL_BASE_URL` | API base URL (default: `https://cloud-task.oomol.com/v1`) | No |
| `MCP_SERVER_NAME` | MCP Server name (default: oomol-cloud-task) | No |
| `MCP_SERVER_VERSION` | MCP Server version (default: 1.0.0) | No |

### ServerOptions

```typescript
interface ServerOptions {
  apiKey: string;                // Required: API Key
  baseUrl?: string;             // Optional: API base URL
  name?: string;                // Optional: Server name
  version?: string;             // Optional: Server version
  defaultHeaders?: Record<string, string>; // Optional: Custom HTTP headers
  maxPollIntervalMs?: number;   // Optional: Max polling interval (default: 30000ms)
}
```

## Tools Reference

### list_applets

**Purpose**: List all available Oomol Cloud API applets

**Use Cases**:

- View all executable APIs in current account
- Get appletID for subsequent task creation
- Browse available cloud functions

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Max number of applets to return (1-100, default: unlimited) |
| `skip` | number | No | Number of applets to skip for pagination (default: 0) |

**Returns**:
```typescript
Array<{
  appletID: string;        // API ID for executing tasks
  title: string;           // API name
  description: string;     // Description
  enabled: boolean;        // Whether enabled
  packageId: string;       // Package ID
  blockName: string;       // Block name
  presetInputs?: object;   // Preset parameters
  createdAt: string;       // Creation time (ISO format)
}>
```

### execute_task

**Purpose**: Create a task and wait for execution completion (recommended)

**Use Cases**:

- Need immediate task results
- Short-running tasks (< 5 minutes)
- Interactive operations

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appletID` | string | Yes | Applet ID |
| `inputValues` | object | Yes | Input parameters |
| `webhookUrl` | string | No | Webhook callback URL |
| `metadata` | object | No | Metadata |
| `pollIntervalMs` | number | No | Polling interval (default: 3000ms) |
| `timeoutMs` | number | No | Timeout in milliseconds |

**Returns**:
```typescript
{
  taskID: string;
  status: "success" | "failed";
  resultData?: unknown;  // Returned on success
  error?: string;        // Returned on failure
}
```

### create_task

**Purpose**: Create a task only, without waiting for results

**Use Cases**:

- Long-running tasks (> 5 minutes)
- Batch tasks
- Use webhook for async result notification

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appletID` | string | Yes | Applet ID |
| `inputValues` | object | Yes | Input parameters |
| `webhookUrl` | string | No | Webhook callback URL (recommended) |
| `metadata` | object | No | Metadata |

**Returns**:
```typescript
{
  taskID: string;
}
```

## Error Handling

The SDK captures and formats the following error types:

- **ApiError**: HTTP request failure (includes status code and response body)
- **TaskFailedError**: Task execution failure (includes task ID and error details)
- **TimeoutError**: Timeout error

Error response format:
```json
{
  "error": "Error message",
  "details": {
    "name": "Error type",
    "message": "Detailed information",
    ...
  }
}
```

## Progress Logging

When using `execute_task`, task execution progress is output to `stderr` (does not affect MCP protocol communication):

```
[Task abc-123] status=running progress=25%
[Task abc-123] status=running progress=50%
[Task abc-123] status=running progress=100%
```

## Development

### Build Project

```bash
npm install
npm run build
```

### Run Examples

```bash
export OOMOL_API_KEY="your-key"
npm run build
node examples/basic-server.ts
```

## Project Structure

```
oomol-cloud-mcp-sdk/
├── src/
│   ├── index.ts              # Main entry
│   ├── server.ts             # MCP Server core class
│   ├── types.ts              # Type definitions
│   ├── tools/
│   │   ├── index.ts          # Tool registry
│   │   ├── list-applets.ts   # list_applets Tool
│   │   ├── execute-task.ts   # execute_task Tool
│   │   └── create-task.ts    # create_task Tool
│   └── utils/
│       └── response-formatter.ts # Response formatter
├── examples/
│   ├── basic-server.ts       # Basic example
│   └── mcp-config.json       # MCP Client config example
└── dist/                     # Build output
```

## Dependencies

- `@modelcontextprotocol/sdk` - Official MCP protocol implementation
- `oomol-cloud-task-sdk` - Oomol Cloud Task API client

## Related Links

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [oomol-cloud-task-sdk](https://www.npmjs.com/package/oomol-cloud-task-sdk)

## License

MIT

## Support

For issues or suggestions, please submit an issue or contact us.
