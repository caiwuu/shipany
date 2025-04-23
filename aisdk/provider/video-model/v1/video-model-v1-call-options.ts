import { JSONValue } from "@ai-sdk/provider";

export type VideoModelV1CallOptions = {
  prompt: string;
  n: number;
  providerOptions?: Record<string, Record<string, JSONValue>>;
  abortSignal?: AbortSignal;
  headers?: Record<string, string | undefined>;
};
