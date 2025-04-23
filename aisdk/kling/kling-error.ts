import { createJsonErrorResponseHandler } from "@ai-sdk/provider-utils";
import { z } from "zod";

const klingErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const klingFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: klingErrorSchema,
  errorToMessage: (error) =>
    error.message ?? error.code ?? "Unknown Kling error",
});
