import { JSONValue, experimental_generateImage as generateImage } from "ai";
import { respData, respErr } from "@/lib/resp";

import type { ImageModelV1 } from "@ai-sdk/provider";
import { getUuid } from "@/lib/hash";
import { kling } from "@/aisdk/kling";
import { newStorage } from "@/lib/storage";
import { openai } from "@ai-sdk/openai";
import { replicate } from "@ai-sdk/replicate";

export async function POST(req: Request) {
  try {
    const { prompt, provider, model } = await req.json();
    if (!prompt || !provider || !model) {
      return respErr("invalid params");
    }

    let imageModel: ImageModelV1;
    let providerOptions: Record<string, Record<string, JSONValue>> = {};

    switch (provider) {
      case "openai":
        imageModel = openai.image(model);
        providerOptions = {
          openai: {
            quality: "hd",
            style: "natural",
          },
        };
        break;
      case "replicate":
        imageModel = replicate.image(model);
        providerOptions = {
          replicate: {
            output_quality: 90,
          },
        };
        break;
      case "kling":
        imageModel = kling.image(model);
        providerOptions = {
          kling: {},
        };
        break;
      default:
        return respErr("invalid provider");
    }

    const { images, warnings } = await generateImage({
      model: imageModel,
      prompt: prompt,
      n: 1,
      providerOptions,
    });

    if (warnings.length > 0) {
      console.log("gen images warnings:", provider, warnings);
      return respErr("gen images failed");
    }

    const storage = newStorage();

    const batch = getUuid();

    const processedImages = await Promise.all(
      images.map(async (image, index) => {
        const filename = `${provider}_image_${batch}_${index}.png`;
        const key = `shipany/${filename}`;
        const body = Buffer.from(image.base64, "base64");

        try {
          const res = await storage.uploadFile({
            body,
            key,
            contentType: "image/png",
            disposition: "inline",
          });

          return {
            ...res,
            provider,
            filename,
          };
        } catch (err) {
          console.log("upload file failed:", err);
          return {
            provider,
            filename,
          };
        }
      })
    );

    return respData(processedImages);
  } catch (err) {
    console.log("gen image failed:", err);
    return respErr("gen image failed");
  }
}
