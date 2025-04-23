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
    image,
    image_fidelity,
    n,
    aspect_ratio = "16:9",
    callback_url,
    ...params
  }: {
    model?: "kling-v1";
    prompt: string;
    negative_prompt?: string;
    image?: string;
    image_fidelity?: number;
    n?: number;
    aspect_ratio?: string;
    callback_url?: string;
    [key: string]: any;
  }): Promise<Response> {
    try {
      const uri = `${baseUrl}/v1/images/generations`;
      const req = {
        model,
        prompt,
        negative_prompt,
        image,
        image_fidelity,
        n,
        aspect_ratio,
        callback_url,
        ...params,
      };

      console.log("Image Generation request:", this.token, uri, req);

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
      console.error("Image Generation API call failed:", error);
      throw error;
    }
  }

  async queryTask({ task_id }: { task_id: string }): Promise<Response> {
    try {
      const uri = `${baseUrl}/v1/images/generations/${task_id}`;
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
      console.error("Image Generation Query Task API call failed:", e);
      throw e;
    }
  }

  async queryTasks({
    page = 1,
    limit = 30,
  }: {
    page?: number;
    limit?: number;
  }): Promise<Response> {
    try {
      if (page < 1 || page > 1000) {
        throw new Error("invalid page");
      }
      if (limit < 1 || limit > 500) {
        throw new Error("invalid limit");
      }

      const uri = `${baseUrl}/v1/images/generations?pageNum=${page}&pageSize=${limit}`;
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
      console.error("Image Generation Query Tasks API call failed:", e);
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
