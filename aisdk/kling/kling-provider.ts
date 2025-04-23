import { KlingImageModelId, KlingImageSettings } from "./kling-image-settings";

import type { FetchFunction } from "@ai-sdk/provider-utils";
import { KlingImageModel } from "./kling-image-model";
import { KlingVideoModel } from "./kling-video-model";
import { KlingVideoModelId } from "./kling-video-settings";
import { KlingVideoSettings } from "./kling-video-settings";
import { loadSetting } from "@ai-sdk/provider-utils";

export interface KlingProviderSettings {
  accessKey?: string;
  secretKey?: string;
  baseURL?: string;
  headers?: Record<string, string>;
  fetch?: FetchFunction;
}

export interface KlingProvider {
  image(
    modelId: KlingImageModelId,
    settings?: KlingImageSettings
  ): KlingImageModel;
  video(
    modelId: KlingVideoModelId,
    settings?: KlingVideoSettings
  ): KlingVideoModel;
}

export function createKling(
  options: KlingProviderSettings = {}
): KlingProvider {
  const loadAccessKey = () =>
    loadSetting({
      settingValue: options.accessKey,
      settingName: "accessKey",
      environmentVariableName: "KLING_ACCESS_KEY",
      description: "Kling access key",
    });

  const loadSecretKey = () =>
    loadSetting({
      settingValue: options.secretKey,
      settingName: "secretKey",
      environmentVariableName: "KLING_SECRET_KEY",
      description: "Kling secret key",
    });

  return {
    image: (modelId: KlingImageModelId, settings?: KlingImageSettings) => {
      return new KlingImageModel(modelId, settings ?? {}, {
        accessKey: loadAccessKey(),
        secretKey: loadSecretKey(),
        provider: "kling",
        baseURL: options.baseURL ?? "https://api.klingai.com",
        headers: {
          ...options.headers,
        },
        fetch: options.fetch,
      });
    },
    video: (modelId: KlingVideoModelId, settings?: KlingVideoSettings) => {
      return new KlingVideoModel(
        modelId,
        {
          maxVideosPerCall: 1,
        },
        {
          accessKey: loadAccessKey(),
          secretKey: loadSecretKey(),
          provider: "kling",
          baseURL: options.baseURL ?? "https://api.klingai.com",
          headers: {
            ...options.headers,
          },
          fetch: options.fetch,
        }
      );
    },
  };
}

export const kling = createKling();
