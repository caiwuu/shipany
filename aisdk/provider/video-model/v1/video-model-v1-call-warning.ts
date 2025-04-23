import { VideoModelV1CallOptions } from "./video-model-v1-call-options";

export type VideoModelV1CallWarning =
  | {
      type: "unsupported-setting";
      setting: keyof VideoModelV1CallOptions;
      details?: string;
    }
  | {
      type: "other";
      message: string;
    };
