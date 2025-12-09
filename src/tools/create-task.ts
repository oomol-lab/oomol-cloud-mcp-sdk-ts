import { OomolTaskClient } from "oomol-cloud-task-sdk";

export async function handleCreateTask(
  args: {
    appletID: string;
    inputValues: Record<string, unknown>;
    webhookUrl?: string;
    metadata?: Record<string, unknown>;
  },
  taskClient: OomolTaskClient
) {
  try {
    const { taskID } = await taskClient.createTask({
      appletID: args.appletID,
      inputValues: args.inputValues,
      webhookUrl: args.webhookUrl,
      metadata: args.metadata,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ taskID }, null, 2),
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
