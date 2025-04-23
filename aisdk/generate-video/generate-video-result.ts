import { VideoGenerationWarning } from "@/aisdk/types/video-model";

export interface GenerateVideoResult {
  readonly video: GeneratedVideo;
  readonly videos: Array<GeneratedVideo>;
  readonly warnings: Array<VideoGenerationWarning>;
}

export interface GeneratedVideo {
  readonly base64: string;
  readonly uint8Array: Uint8Array;
}
