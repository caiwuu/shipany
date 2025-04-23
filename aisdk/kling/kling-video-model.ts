import { KlingVideoModelId, KlingVideoSettings } from "./kling-video-settings";
import type { VideoModelV1, VideoModelV1CallWarning } from "@/aisdk/provider";

import { FetchFunction } from "@ai-sdk/provider-utils";
import type { Resolvable } from "@ai-sdk/provider-utils";
import { newClient } from "./text2video";

interface KlingVideoModelConfig {
  accessKey: string;
  secretKey: string;
  provider: string;
  baseURL: string;
  headers: Resolvable<Record<string, string | undefined>>;
  fetch?: FetchFunction;
}

export class KlingVideoModel implements VideoModelV1 {
  readonly specificationVersion = "v1";

  readonly modelId: KlingVideoModelId;
  readonly settings: KlingVideoSettings;

  private readonly config: KlingVideoModelConfig;

  get provider(): string {
    return this.config.provider;
  }

  get maxVideosPerCall(): number {
    return this.settings.maxVideosPerCall ?? 1;
  }

  constructor(
    modelId: KlingVideoModelId,
    settings: KlingVideoSettings,
    config: KlingVideoModelConfig
  ) {
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }

  async doGenerate({
    prompt,
    n,
    providerOptions,
    headers,
    abortSignal,
  }: Parameters<VideoModelV1["doGenerate"]>[0]): Promise<
    Awaited<ReturnType<VideoModelV1["doGenerate"]>>
  > {
    const warnings: Array<VideoModelV1CallWarning> = [];
    let videos: Array<Uint8Array> = [];

    const videoUrls: Array<string> = [];

    if (!this.config.accessKey || !this.config.secretKey) {
      warnings.push({
        type: "other",
        message: "Kling access key or secret key is not set",
      });
      return { videos, warnings };
    }

    try {
      const client = await newClient({
        accessKey: this.config.accessKey,
        secretKey: this.config.secretKey,
      });

      const task = await client.createTask({
        model: this.modelId,
        prompt,
        n,
        ...(providerOptions?.kling ?? {}),
      });

      if (!task.data || !task.data.task_id) {
        warnings.push({
          type: "other",
          message: task.message,
        });
        return { videos, warnings };
      }

      const taskId = task.data.task_id;

      const maxAttempts = 20;
      const pollingInterval = 30000;
      let attempts = 0;

      while (attempts < maxAttempts) {
        const result = await client.queryTask({ task_id: taskId });
        console.log("kling gen videos result:", JSON.stringify(result));

        if (!result.data || !result.data.task_status) {
          continue;
        }

        if (result.data.task_status === "succeed") {
          if (result.data.task_result && result.data.task_result.videos) {
            result.data.task_result.videos.forEach((video: any) => {
              videoUrls.push(video.url);
            });
          }
          break;
        } else if (result.data.task_status === "failed") {
          warnings.push({
            type: "other",
            message: result.data.task_status_msg || "Task failed",
          });
          break;
        }

        if (abortSignal?.aborted) {
          throw new Error("Operation aborted");
        }

        attempts++;
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      }

      if (attempts >= maxAttempts) {
        warnings.push({
          type: "other",
          message: "Task timed out",
        });
      }
    } catch (error: any) {
      console.error("Kling generate video failed:", error);
      warnings.push({
        type: "other",
        message: error.message,
      });
    }

    if (videoUrls.length === 0) {
      warnings.push({
        type: "other",
        message: "No videos generated",
      });
      return { videos, warnings };
    }

    videos = await Promise.all(
      videoUrls.map(async (url) => {
        const response = await fetch(url);
        return new Uint8Array(await response.arrayBuffer());
      })
    );

    return { videos, warnings };
  }
}
