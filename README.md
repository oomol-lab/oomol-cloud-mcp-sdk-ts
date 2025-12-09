# oomol-cloud-mcp-sdk

MCP Server SDK for Oomol Cloud Task API - 将 Oomol Cloud 任务执行能力封装为符合 [Model Context Protocol](https://modelcontextprotocol.io) 的工具。

## 特性

- ✅ **完整的 MCP 协议支持**: 基于官方 `@modelcontextprotocol/sdk` 实现
- ✅ **Stdio 传输**: 支持 Cherry Studio、VSCode、Claude Desktop 等 MCP Client
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **零业务逻辑重复**: 完全复用 `oomol-cloud-task-sdk`
- ✅ **简洁 API**: 3 个核心 Tool 覆盖主要使用场景

## 安装

```bash
npm install -g oomol-cloud-mcp-sdk
```

或者在项目中作为依赖安装：

```bash
npm install oomol-cloud-mcp-sdk
```

## 快速开始

### 1. 作为 MCP Server 运行

设置环境变量并启动 Server：

```bash
export OOMOL_API_KEY="your-api-key"
oomol-mcp-server
```

### 2. 在 MCP Client 中配置

#### Cherry Studio / Claude Desktop

在 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "oomol-cloud": {
      "command": "npx",
      "args": ["oomol-cloud-mcp-sdk"],
      "env": {
        "OOMOL_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### VSCode

在 VSCode 的 MCP 配置中添加相同的配置。

### 3. 使用 Tools

配置完成后，你可以在 MCP Client 中使用以下 Tools：

#### `list_applets` - 获取可用的 Applet 列表

```json
{
  "name": "list_applets",
  "arguments": {
    "limit": 10,
    "skip": 0
  }
}
```

**响应**:
```json
[
  {
    "appletID": "abc-123",
    "title": "图片处理 API",
    "description": "处理图片的云函数",
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

#### `execute_task` - 执行任务并等待结果

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

**响应**:
```json
{
  "taskID": "task-uuid",
  "status": "success",
  "resultData": {
    "output": "..."
  }
}
```

#### `create_task` - 仅创建任务（不等待）

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

**响应**:
```json
{
  "taskID": "task-uuid"
}
```

## 编程使用

你也可以在代码中导入并使用：

```typescript
import { OomolMcpServer } from "oomol-cloud-mcp-sdk";

const server = new OomolMcpServer({
  apiKey: "your-api-key",
  name: "my-server",
  version: "1.0.0",
});

await server.run();
```

## 配置选项

### 环境变量

| 变量名 | 说明 | 必填 |
|-------|------|------|
| `OOMOL_API_KEY` | Oomol Cloud API Key | 是 |
| `OOMOL_BASE_URL` | API 基础 URL（默认：https://cloud-task.oomol.com/v1） | 否 |
| `MCP_SERVER_NAME` | MCP Server 名称（默认：oomol-cloud-task） | 否 |
| `MCP_SERVER_VERSION` | MCP Server 版本（默认：1.0.0） | 否 |

### ServerOptions

```typescript
interface ServerOptions {
  apiKey: string;                // 必填：API Key
  baseUrl?: string;             // 可选：API 基础 URL
  name?: string;                // 可选：Server 名称
  version?: string;             // 可选：Server 版本
  defaultHeaders?: Record<string, string>; // 可选：自定义 HTTP Headers
  maxPollIntervalMs?: number;   // 可选：轮询最大间隔（默认 30000ms）
}
```

## Tools 详细说明

### list_applets

**用途**: 获取所有可用的 Oomol Cloud API Applet 列表

**适用场景**:

- 查看当前账号下所有可执行的 API
- 获取 appletID 用于后续任务创建
- 浏览可用的云函数

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `limit` | number | 否 | 返回数量限制（1-100，默认无限制） |
| `skip` | number | 否 | 分页偏移量（默认 0） |

**返回**:
```typescript
Array<{
  appletID: string;        // API ID，用于执行任务
  title: string;           // API 名称
  description: string;     // 描述
  enabled: boolean;        // 是否启用
  packageId: string;       // 包 ID
  blockName: string;       // Block 名称
  presetInputs?: object;   // 预设参数
  createdAt: string;       // 创建时间（ISO 格式）
}>
```

### execute_task

**用途**: 创建任务并等待执行完成（推荐使用）

**适用场景**:
- 需要立即获得任务结果
- 任务执行时间较短（< 5 分钟）
- 交互式操作

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `appletID` | string | 是 | Applet ID |
| `inputValues` | object | 是 | 输入参数 |
| `webhookUrl` | string | 否 | Webhook 回调 URL |
| `metadata` | object | 否 | 元数据 |
| `pollIntervalMs` | number | 否 | 轮询间隔（默认 3000ms） |
| `timeoutMs` | number | 否 | 超时时间（毫秒） |

**返回**:
```typescript
{
  taskID: string;
  status: "success" | "failed";
  resultData?: unknown;  // 成功时返回
  error?: string;        // 失败时返回
}
```

### create_task

**用途**: 仅创建任务，不等待结果

**适用场景**:
- 长时间任务（> 5 分钟）
- 批量任务
- 使用 Webhook 异步接收结果

**参数**:

| 参数 | 类型 | 必填 | 说明 |
|-----|------|------|------|
| `appletID` | string | 是 | Applet ID |
| `inputValues` | object | 是 | 输入参数 |
| `webhookUrl` | string | 否 | Webhook 回调 URL（推荐） |
| `metadata` | object | 否 | 元数据 |

**返回**:
```typescript
{
  taskID: string;
}
```

## 错误处理

SDK 会捕获并格式化以下错误类型：

- **ApiError**: HTTP 请求失败（包含状态码和响应体）
- **TaskFailedError**: 任务执行失败（包含任务 ID 和错误详情）
- **TimeoutError**: 超时错误

错误响应格式：
```json
{
  "error": "错误消息",
  "details": {
    "name": "错误类型",
    "message": "详细信息",
    ...
  }
}
```

## 进度日志

使用 `execute_task` 时，任务执行进度会输出到 `stderr`（不影响 MCP 协议通信）：

```
[Task abc-123] status=running progress=25%
[Task abc-123] status=running progress=50%
[Task abc-123] status=running progress=100%
```

## 开发

### 构建项目

```bash
npm install
npm run build
```

### 运行示例

```bash
export OOMOL_API_KEY="your-key"
npm run build
node examples/basic-server.ts
```

## 项目结构

```
oomol-cloud-mcp-sdk/
├── src/
│   ├── index.ts              # 主入口
│   ├── server.ts             # MCP Server 核心类
│   ├── types.ts              # 类型定义
│   ├── tools/
│   │   ├── index.ts          # Tool 注册中心
│   │   ├── list-applets.ts   # list_applets Tool
│   │   ├── execute-task.ts   # execute_task Tool
│   │   └── create-task.ts    # create_task Tool
│   └── utils/
│       └── response-formatter.ts # 响应格式化
├── examples/
│   ├── basic-server.ts       # 基础示例
│   └── mcp-config.json       # MCP Client 配置示例
└── dist/                     # 编译输出
```

## 依赖

- `@modelcontextprotocol/sdk` - MCP 协议官方实现
- `oomol-cloud-task-sdk` - Oomol Cloud Task API 客户端
- `zod` - 参数验证库

## 相关链接

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [oomol-cloud-task-sdk](https://www.npmjs.com/package/oomol-cloud-task-sdk)

## 许可证

MIT

## 支持

如有问题或建议，请提交 Issue 或联系我们。
