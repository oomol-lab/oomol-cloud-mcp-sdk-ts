import type { OomolTaskClient } from "oomol-cloud-task-sdk";
import { formatErrorResponse, formatSuccessResponse } from "../utils/response-formatter.js";

export async function handleUploadFile(
  args: {
    fileName: string;
    fileData: string;
    mimeType?: string;
    retries?: number;
  },
  taskClient: OomolTaskClient
) {
  try {
    const buffer = Buffer.from(args.fileData, "base64");
    const file = new File([buffer], args.fileName, {
      type: args.mimeType ?? "application/octet-stream",
    });

    const fileUrl = await taskClient.uploadFile(file, {
      retries: args.retries,
      onProgress: (progress) => {
        console.error(`[Upload ${args.fileName}] progress=${progress}%`);
      },
    });

    return formatSuccessResponse({
      fileUrl,
      fileName: args.fileName,
      fileSize: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    return formatErrorResponse(error);
  }
}
