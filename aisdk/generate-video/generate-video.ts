import { GenerateVideoResult, GeneratedVideo } from "./generate-video-result";
import {
  convertBase64ToUint8Array,
  convertUint8ArrayToBase64,
} from "@ai-sdk/provider-utils";

import { JSONValue } from "@ai-sdk/provider";
import { VideoGenerationWarning } from "../types/video-model";
import { VideoModelV1 } from "@/aisdk/provider";

export async function generateVideo({
  model,
  prompt,
  n = 1,
  providerOptions,
  maxRetries,
  abortSignal,
  headers,
}: {
  model: VideoModelV1;
  prompt: string;
  n?: number;
  providerOptions?: Record<string, Record<string, JSONValue>>;
  maxRetries?: number;
  abortSignal?: AbortSignal;
  headers?: Record<string, string>;
}): Promise<GenerateVideoResult> {
  const maxVideosPerCall = model.maxVideosPerCall ?? 1;

  const callCount = Math.ceil(n / maxVideosPerCall);
  const callVideoCounts = Array.from({ length: callCount }, (_, i) => {
    if (i < callCount - 1) {
      return maxVideosPerCall;
    }

    const remainder = n % maxVideosPerCall;
    return remainder === 0 ? maxVideosPerCall : remainder;
  });

  const results = await Promise.all(
    callVideoCounts.map(async (callVideoCount) =>
      model.doGenerate({
        prompt,
        n: callVideoCount,
        abortSignal,
        headers,
        providerOptions: providerOptions ?? {},
      })
    )
  );

  const videos: Array<DefaultGeneratedVideo> = [];
  const warnings: Array<VideoGenerationWarning> = [];

  for (const result of results) {
    videos.push(
      ...result.videos.map((video) => new DefaultGeneratedVideo({ video }))
    );
    warnings.push(...result.warnings);
  }

  return new DefaultGenerateVideoResult({ videos, warnings });
}

class DefaultGenerateVideoResult implements GenerateVideoResult {
  readonly videos: Array<GeneratedVideo>;
  readonly warnings: Array<VideoGenerationWarning>;

  constructor(options: {
    videos: Array<DefaultGeneratedVideo>;
    warnings: Array<VideoGenerationWarning>;
  }) {
    this.videos = options.videos;
    this.warnings = options.warnings;
  }

  get video() {
    return this.videos[0];
  }
}

class DefaultGeneratedVideo implements GeneratedVideo {
  private base64Data: string | undefined;
  private uint8ArrayData: Uint8Array | undefined;

  constructor({ video }: { video: string | Uint8Array }) {
    const isUint8Array = video instanceof Uint8Array;

    this.base64Data = isUint8Array ? undefined : video;
    this.uint8ArrayData = isUint8Array ? video : undefined;
  }

  get base64() {
    if (this.base64Data == null) {
      this.base64Data = convertUint8ArrayToBase64(this.uint8ArrayData!);
    }
    return this.base64Data;
  }

  get uint8Array() {
    if (this.uint8ArrayData == null) {
      this.uint8ArrayData = convertBase64ToUint8Array(this.base64Data!);
    }
    return this.uint8ArrayData;
  }
}
