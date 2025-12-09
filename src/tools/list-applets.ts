import { OomolTaskClient } from "oomol-cloud-task-sdk";
import type { ServerOptions } from "../types.js";

interface ApiAppletData {
  id: string;
  enabled: boolean;
  title?: string;
  description?: string;
  packageId: string;
  blockName: string;
  presetInputs?: Record<string, any>;
  createdAt: number;
}

interface ApiApplet {
  apiAppletId: string;
  userId: string;
  data: ApiAppletData;
  createdAt: number;
  updatedAt: number;
}

export async function handleListApplets(
  args: { limit?: number; skip?: number },
  taskClient: OomolTaskClient,
  options: ServerOptions
) {
  try {
    const baseUrl = options.baseUrl || "https://chat-data.oomol.com";
    const url = `${baseUrl}/rpc/listApiApplets`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.defaultHeaders,
      },
      credentials: "include",
      body: JSON.stringify({
        limit: args.limit,
        skip: args.skip,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch applets: ${response.status} ${response.statusText}`
      );
    }

    const applets = (await response.json()) as ApiApplet[];

    // 格式化返回结果,提取关键信息
    const formattedApplets = applets.map((applet) => ({
      appletID: applet.apiAppletId,
      title: applet.data.title || "Untitled",
      description: applet.data.description || "",
      enabled: applet.data.enabled,
      packageId: applet.data.packageId,
      blockName: applet.data.blockName,
      presetInputs: applet.data.presetInputs,
      createdAt: new Date(applet.data.createdAt).toISOString(),
    }));

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(formattedApplets, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            ...(error as any),
          }
        : error;

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: errorMessage,
              details: errorDetails,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}
