import {
  LanguageModelV1,
  extractReasoningMiddleware,
  streamText,
  wrapLanguageModel,
} from "ai";

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import { respErr } from "@/lib/resp";

export async function POST(req: Request) {
  try {
    const { prompt, provider, model } = await req.json();
    if (!prompt || !provider || !model) {
      return respErr("invalid params");
    }

    let textModel: LanguageModelV1;

    switch (provider) {
      case "openai":
        textModel = openai(model);
        break;
      case "deepseek":
        textModel = deepseek(model);
        break;
      case "openrouter":
        const openrouter = createOpenRouter({
          apiKey: process.env.OPENROUTER_API_KEY,
        });
        textModel = openrouter(model);

        if (model === "deepseek/deepseek-r1") {
          const enhancedModel = wrapLanguageModel({
            model: textModel,
            middleware: extractReasoningMiddleware({ tagName: "think" }),
          });
          textModel = enhancedModel;
        }
        break;
      case "siliconflow":
        const siliconflow = createOpenAICompatible({
          name: "siliconflow",
          apiKey: process.env.SILICONFLOW_API_KEY,
          baseURL: process.env.SILICONFLOW_BASE_URL,
        });
        textModel = siliconflow(model);

        if (model === "deepseek-ai/DeepSeek-R1") {
          const enhancedModel = wrapLanguageModel({
            model: textModel,
            middleware: extractReasoningMiddleware({
              tagName: "reasoning_content",
            }),
          });
          textModel = enhancedModel;
        }
        break;
      default:
        return respErr("invalid provider");
    }

    const result = await streamText({
      model: textModel,
      prompt: prompt,
      onChunk: async (chunk) => {
        console.log("chunk", chunk);
      },
      onFinish: async () => {
        console.log("finish", await result.text);
      },
    });

    return result.toDataStreamResponse({
      sendReasoning: true,
    });
  } catch (err) {
    console.log("gen text stream failed:", err);
    return respErr("gen text stream failed");
  }
}
