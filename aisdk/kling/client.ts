export interface Config {
  accessKey: string;
  secretKey: string;
}

export interface Response {
  code: number;
  message: string;
  request_id: string;
  data?: any;
}

export const baseUrl = "https://api.klingai.com";

export async function getToken(config: Config): Promise<string> {
  try {
    const now = Math.floor(Date.now() / 1000);

    // Create the JWT header and payload
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const payload = {
      iss: config.accessKey,
      exp: now + 1800, // Current time + 30 minutes
      nbf: now - 5, // Current time - 5 seconds
    };

    // Encode header and payload
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
      "base64url"
    );
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url"
    );

    // Create the signature input
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    // Convert secret key to Uint8Array
    const keyData = new TextEncoder().encode(config.secretKey);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Sign the input
    const signature = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      new TextEncoder().encode(signatureInput)
    );

    // Convert signature to base64url
    const encodedSignature = Buffer.from(signature).toString("base64url");

    // Combine to create the JWT
    const token = `${signatureInput}.${encodedSignature}`;

    return token;
  } catch (error) {
    console.error("Failed to generate JWT token:", error);
    throw error;
  }
}
