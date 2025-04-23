import { Config, Response, baseUrl, getToken } from "./client";

class Client {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async createTask({
    model = "kling-v1",
    prompt,
    negative_prompt,
    cfg_scale = 0.5,
    mode = "std",
    camera_control,
    aspect_ratio = "16:9",
    duration = 5,
    callback_url,
    external_task_id,
    ...params
  }: {
    model?: "kling-v1" | "kling-v1-6";
    prompt: string;
    negative_prompt?: string;
    cfg_scale?: number;
    mode?: "std" | "pro";
    camera_control?: any;
    aspect_ratio?: "16:9" | "9:16" | "1:1";
    duration?: 5 | 10;
    callback_url?: string;
    external_task_id?: string;
    [key: string]: any;
  }): Promise<Response> {
    try {
      const uri = `${baseUrl}/v1/videos/text2video`;
      const req = {
        model_name: model,
        prompt,
        negative_prompt,
        cfg_scale,
        mode,
        camera_control,
        aspect_ratio,
        duration,
        callback_url,
        external_task_id,
        ...params,
      };

      console.log("request text2video:", uri, req);

      const response = await fetch(uri, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Text2Video API call failed:", error);
      throw error;
    }
  }

  async queryTask({ task_id }: { task_id: string }): Promise<Response> {
    try {
      const uri = `${baseUrl}/v1/videos/text2video/${task_id}`;
      console.log("query task:", uri);
      const response = await fetch(uri, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (e) {
      console.error("Text2Video API call failed:", e);
      throw e;
    }
  }
}

export async function newClient(config?: Config): Promise<Client> {
  if (!config) {
    config = {
      accessKey: process.env.KLING_ACCESS_KEY!,
      secretKey: process.env.KLING_SECRET_KEY!,
    };
  }

  const token = await getToken(config);

  return new Client(token);
}
