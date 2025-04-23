import { VideoModelV1CallOptions } from "./video-model-v1-call-options";
import { VideoModelV1CallWarning } from "./video-model-v1-call-warning";

export type VideoModelV1 = {
  readonly specificationVersion: "v1";

  readonly provider: string;

  readonly modelId: string;

  readonly maxVideosPerCall: number | undefined;

  doGenerate(options: VideoModelV1CallOptions): PromiseLike<{
    videos: Array<string> | Array<Uint8Array>;
    warnings: Array<VideoModelV1CallWarning>;
  }>;
};
