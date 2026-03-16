# oomol-cloud-mcp-sdk

面向 Oomol Cloud Task API v3 的 MCP Server SDK。这个包现在与 [`oomol-cloud-task-sdk`](https://www.npmjs.com/package/oomol-cloud-task-sdk) 对齐：完整透出 Cloud Task TS SDK 的 API、类型和错误，并在其上增加 MCP server 支持。

[English](README.md) | **简体中文**

## 特性

- 基于 `@modelcontextprotocol/sdk` 的完整 MCP server 支持
- 完整 re-export `oomol-cloud-task-sdk` 的 API、类型和错误
- 使用与 Cloud Task TS SDK 一致的 `serverless task` 模型
- 提供任务创建、执行、查询、队列控制、文件上传等 MCP tools
- 保留 `create_block_task` 和 `execute_block_task` 两个兼容别名

## 安装

```bash
npm install oomol-cloud-mcp-sdk
```

## 快速开始

### 作为 MCP Server 运行

```bash
export OOMOL_API_KEY="your-api-key"
oomol-mcp-server
```

如果希望 MCP task tools 默认使用某个 package，再额外设置：

```bash
export OOMOL_PACKAGE_NAME="@oomol/your-package"
export OOMOL_PACKAGE_VERSION="1.0.0"
```

### 配置 MCP Client

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

## 编程使用

### 直接当作 Cloud Task TS SDK 使用

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

### 以代码方式启动 MCP Server

```ts
import { OomolMcpServer } from "oomol-cloud-mcp-sdk";

const server = new OomolMcpServer({
  apiKey: process.env.OOMOL_API_KEY,
  packageName: process.env.OOMOL_PACKAGE_NAME,
  packageVersion: process.env.OOMOL_PACKAGE_VERSION,
});

await server.run();
```

`server.taskClient` 可直接访问底层的 `OomolTaskClient` 实例。

## MCP Tools

与 Cloud Task TS SDK 对齐的核心 tools：

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

兼容别名：

- `create_block_task` -> `create_task`
- `execute_block_task` -> `execute_task`

### `create_task`

使用与 `OomolTaskClient.createTask()` 一致的请求结构；如果没传 `packageName` / `packageVersion`，会优先从 server 配置里补默认值。

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

与 `create_task` 使用同样的任务参数，并额外支持轮询参数：

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

### 查询和控制类 tools

- `list_tasks` 支持与 `listTasks(query?)` 一致的筛选参数
- `get_latest_tasks` 支持 `workloadIDs: string[] | string`
- `await_result` 支持 `taskID`、`intervalMs`、`timeoutMs`
- `set_tasks_pause` 接收 `{ "paused": true | false }`

### `upload_file`

接收 base64 编码的文件内容：

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

## 导出内容

这个包会导出：

- `OomolMcpServer`
- `ServerOptions`
- `ToolResponse`
- `oomol-cloud-task-sdk` 的全部导出

也就是除了 MCP server 自身，还能直接拿到 `OomolTaskClient`、所有 Cloud Task 类型、`BackoffStrategy`，以及 `ApiError`、`TaskFailedError`、`TimeoutError`、`UploadError` 等错误类型。

## 配置

### 环境变量

| 变量 | 说明 | 必填 |
| --- | --- | --- |
| `OOMOL_API_KEY` | Oomol Cloud API key，MCP server 在 Node.js 环境下一般需要 | 通常需要 |
| `OOMOL_BASE_URL` | Cloud Task API 基础 URL | 否 |
| `OOMOL_PACKAGE_NAME` | MCP task tools 的默认 package 名称 | 否 |
| `OOMOL_PACKAGE_VERSION` | MCP task tools 的默认 package 版本 | 否 |
| `MCP_SERVER_NAME` | MCP server 名称 | 否 |
| `MCP_SERVER_VERSION` | MCP server 版本 | 否 |

### `ServerOptions`

`ServerOptions` 继承自 `oomol-cloud-task-sdk` 的 `ClientOptions`，并新增：

```ts
interface ServerOptions extends ClientOptions {
  name?: string;
  version?: string;
  packageName?: string;
  packageVersion?: string;
  maxPollIntervalMs?: number;
}
```

## 开发

```bash
npm install
npm run build
```

## 许可证

MIT
