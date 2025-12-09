# oomol-cloud-mcp-sdk

MCP Server SDK for Oomol Cloud Task API - Wrap Oomol Cloud task execution capabilities into tools compliant with the [Model Context Protocol](https://modelcontextprotocol.io).

将 Oomol Cloud 任务执行能力封装为符合 MCP 协议的工具。

**English** | [简体中文](README.zh-CN.md)

## Features | 特性

- ✅ **Full MCP Protocol Support** | 完整的 MCP 协议支持: Built on official `@modelcontextprotocol/sdk`
- ✅ **Stdio Transport** | Stdio 传输: Compatible with Cherry Studio, VSCode, Claude Desktop and other MCP clients
- ✅ **Type-Safe** | 类型安全: Complete TypeScript type definitions
- ✅ **Zero Business Logic Duplication** | 零业务逻辑重复: Fully reuses `oomol-cloud-task-sdk`
- ✅ **Simple API** | 简洁 API: 3 core tools covering main use cases

## Installation | 安装

Global installation | 全局安装:

```bash
npm install -g oomol-cloud-mcp-sdk
```

Or as a project dependency | 或作为项目依赖:

```bash
npm install oomol-cloud-mcp-sdk
```

## Quick Start | 快速开始

### 1. Run as MCP Server | 作为 MCP Server 运行

Set environment variable and start the server | 设置环境变量并启动服务:

```bash
export OOMOL_API_KEY="your-api-key"
oomol-mcp-server
```

### 2. Configure in MCP Client | 在 MCP 客户端中配置

#### Cherry Studio / Claude Desktop

Add to MCP configuration file | 在 MCP 配置文件中添加:

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

Add the same configuration to VSCode MCP settings | 在 VSCode 的 MCP 配置中添加相同配置。

### 3. Use Tools | 使用工具

After configuration, you can use the following tools in MCP Client | 配置完成后，可在 MCP 客户端中使用以下工具:

#### `list_applets` - List Available Applets | 获取可用的 Applet 列表

Get a list of all available Oomol Cloud API applets | 获取所有可用的 Oomol Cloud API Applet:

```json
{
  "name": "list_applets",
  "arguments": {
    "limit": 10,
    "skip": 0
  }
}
```

**Response | 响应**:
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

#### `execute_task` - Execute Task and Wait for Result | 执行任务并等待结果

Create and execute a task, waiting for completion | 创建并执行任务，等待完成:

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

**Response | 响应**:
```json
{
  "taskID": "task-uuid",
  "status": "success",
  "resultData": {
    "output": "..."
  }
}
```

#### `create_task` - Create Task Only (No Wait) | 仅创建任务（不等待）

Create a task without waiting for results | 创建任务但不等待结果:

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

**Response | 响应**:
```json
{
  "taskID": "task-uuid"
}
```

## Programmatic Usage | 编程使用

You can also import and use in code | 也可在代码中导入使用:

```typescript
import { OomolMcpServer } from "oomol-cloud-mcp-sdk";

const server = new OomolMcpServer({
  apiKey: "your-api-key",
  name: "my-server",
  version: "1.0.0",
});

await server.run();
```

## Configuration Options | 配置选项

### Environment Variables | 环境变量

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

## Tools Reference | 工具详细说明

### list_applets

**Purpose | 用途**: List all available Oomol Cloud API applets | 获取所有可用的 Oomol Cloud API Applet 列表

**Use Cases | 适用场景**:

- View all executable APIs in current account | 查看当前账号下所有可执行的 API
- Get appletID for subsequent task creation | 获取 appletID 用于后续任务创建
- Browse available cloud functions | 浏览可用的云函数

**Parameters | 参数**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Max number of applets to return (1-100, default: unlimited) \| 返回数量限制（1-100，默认无限制） |
| `skip` | number | No | Number of applets to skip for pagination (default: 0) \| 分页偏移量（默认 0） |

**Returns | 返回**:
```typescript
Array<{
  appletID: string;        // API ID for executing tasks | API ID，用于执行任务
  title: string;           // API name | API 名称
  description: string;     // Description | 描述
  enabled: boolean;        // Whether enabled | 是否启用
  packageId: string;       // Package ID | 包 ID
  blockName: string;       // Block name | Block 名称
  presetInputs?: object;   // Preset parameters | 预设参数
  createdAt: string;       // Creation time (ISO format) | 创建时间（ISO 格式）
}>
```

### execute_task

**Purpose | 用途**: Create a task and wait for execution completion (recommended) | 创建任务并等待执行完成（推荐使用）

**Use Cases | 适用场景**:

- Need immediate task results | 需要立即获得任务结果
- Short-running tasks (< 5 minutes) | 任务执行时间较短（< 5 分钟）
- Interactive operations | 交互式操作

**Parameters | 参数**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appletID` | string | Yes | Applet ID |
| `inputValues` | object | Yes | Input parameters \| 输入参数 |
| `webhookUrl` | string | No | Webhook callback URL \| Webhook 回调 URL |
| `metadata` | object | No | Metadata \| 元数据 |
| `pollIntervalMs` | number | No | Polling interval (default: 3000ms) \| 轮询间隔（默认 3000ms） |
| `timeoutMs` | number | No | Timeout in milliseconds \| 超时时间（毫秒） |

**Returns | 返回**:
```typescript
{
  taskID: string;
  status: "success" | "failed";
  resultData?: unknown;  // Returned on success | 成功时返回
  error?: string;        // Returned on failure | 失败时返回
}
```

### create_task

**Purpose | 用途**: Create a task only, without waiting for results | 仅创建任务，不等待结果

**Use Cases | 适用场景**:

- Long-running tasks (> 5 minutes) | 长时间任务（> 5 分钟）
- Batch tasks | 批量任务
- Use webhook for async result notification | 使用 Webhook 异步接收结果

**Parameters | 参数**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appletID` | string | Yes | Applet ID |
| `inputValues` | object | Yes | Input parameters \| 输入参数 |
| `webhookUrl` | string | No | Webhook callback URL (recommended) \| Webhook 回调 URL（推荐） |
| `metadata` | object | No | Metadata \| 元数据 |

**Returns | 返回**:
```typescript
{
  taskID: string;
}
```

## Error Handling | 错误处理

The SDK captures and formats the following error types | SDK 会捕获并格式化以下错误类型:

- **ApiError**: HTTP request failure (includes status code and response body) | HTTP 请求失败（包含状态码和响应体）
- **TaskFailedError**: Task execution failure (includes task ID and error details) | 任务执行失败（包含任务 ID 和错误详情）
- **TimeoutError**: Timeout error | 超时错误

Error response format | 错误响应格式:
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

## Progress Logging | 进度日志

When using `execute_task`, task execution progress is output to `stderr` (does not affect MCP protocol communication) | 使用 `execute_task` 时，任务执行进度会输出到 `stderr`（不影响 MCP 协议通信）:

```
[Task abc-123] status=running progress=25%
[Task abc-123] status=running progress=50%
[Task abc-123] status=running progress=100%
```

## Development | 开发

### Build Project | 构建项目

```bash
npm install
npm run build
```

### Run Examples | 运行示例

```bash
export OOMOL_API_KEY="your-key"
npm run build
node examples/basic-server.ts
```

## Project Structure | 项目结构

```
oomol-cloud-mcp-sdk/
├── src/
│   ├── index.ts              # Main entry | 主入口
│   ├── server.ts             # MCP Server core class | MCP Server 核心类
│   ├── types.ts              # Type definitions | 类型定义
│   ├── tools/
│   │   ├── index.ts          # Tool registry | Tool 注册中心
│   │   ├── list-applets.ts   # list_applets Tool
│   │   ├── execute-task.ts   # execute_task Tool
│   │   └── create-task.ts    # create_task Tool
│   └── utils/
│       └── response-formatter.ts # Response formatter | 响应格式化
├── examples/
│   ├── basic-server.ts       # Basic example | 基础示例
│   └── mcp-config.json       # MCP Client config example | MCP 客户端配置示例
└── dist/                     # Build output | 编译输出
```

## Dependencies | 依赖

- `@modelcontextprotocol/sdk` - Official MCP protocol implementation | MCP 协议官方实现
- `oomol-cloud-task-sdk` - Oomol Cloud Task API client | Oomol Cloud Task API 客户端

## Related Links | 相关链接

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [oomol-cloud-task-sdk](https://www.npmjs.com/package/oomol-cloud-task-sdk)

## License | 许可证

MIT

## Support | 支持

For issues or suggestions, please submit an issue or contact us.

如有问题或建议，请提交 Issue 或联系我们。
