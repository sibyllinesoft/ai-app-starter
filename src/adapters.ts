import { StreamingAdapterObserver } from "@nlux/core";
import { COMPLETIONS_URL, DEFAULT_MODEL } from "./config";

interface AdapterConfig {
  apiUrl?: string;
  model?: string;
  applicationId: string;
  sessionId?: string;
  idToken?: string;
  accessToken?: string;
  openModal: () => void;
}

export const createBatchAdapter = ({
  apiUrl = COMPLETIONS_URL,
  model = DEFAULT_MODEL,
  applicationId,
  sessionId,
  idToken,
  accessToken,
  openModal,
}: AdapterConfig) => {
  let headers: Record<string, string>;
  
  // Ensure applicationId is provided
  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (idToken && accessToken) {
    headers = {
      "X-KeyTrustee-Application-Id": applicationId,
      "Content-Type": "application/json",
      "X-Session-ID": sessionId || "",
    };
  } else if (sessionId) {
    headers = {
      "X-KeyTrustee-Application-Id": applicationId,
      "Content-Type": "application/json",
      "X-Session-ID": sessionId,
    };
  }

  const messages = [];

  const batchText = async (
    message: string,
    // extras: ChatAdapterExtras
  ): Promise<string> => {
    messages.push({ role: "user", content: message });
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: [{ role: "user", content: message }],
        model,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 && (
          response.statusText === "Expired Token" ||
          response.statusText === "Token validation failed" ||
          response.statusText === "Session not found"
        )) {
        openModal();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();
    const content = responseJson.choices[0].message.content;
    messages.push({ role: "assistant", content });
    return content;
  };

  return { batchText };
};

export const createStreamAdapter = ({
  apiUrl = COMPLETIONS_URL,
  model = DEFAULT_MODEL,
  applicationId,
  sessionId,
  idToken,
  accessToken,
  openModal,
}: AdapterConfig) => {
  let headers: Record<string, string>;

  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  if (idToken && accessToken) {
    headers = {
      "X-KeyTrustee-Application-Id": applicationId,
      "Content-Type": "application/json",
      "X-Session-ID": sessionId || "",
    };
  } else if (sessionId) {
    headers = {
      "X-KeyTrustee-Application-Id": applicationId,
      "Content-Type": "application/json",
      "X-Session-ID": sessionId,
    };
  }

  const messages: { role: string; content: string }[] = [];

  const streamText = async (
    message: string,
    observer: StreamingAdapterObserver
  ): Promise<void> => {
    messages.push({ role: "user", content: message });
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages,
        model,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 && (
          response.statusText === "Expired Token" ||
          response.statusText === "Token validation failed" ||
          response.statusText === "Session not found"
        )) {
        openModal();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      observer.error(new Error("Response body not present"));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let boundary;
      while ((boundary = buffer.indexOf("}{")) !== -1) {
        const jsonString = buffer.substring(0, boundary + 1).trim();
        buffer = buffer.slice(boundary + 1);

        try {
          const chunk = JSON.parse(jsonString);
          if (
            chunk.choices &&
            chunk.choices[0] &&
            chunk.choices[0].delta &&
            chunk.choices[0].delta.content
          ) {
            observer.next(chunk.choices[0].delta.content);
          }
        } catch (e) {
          observer.error(new Error("Error while processing chunks"));
        }
      }
    }

    if (buffer.length > 0) {
      try {
        const chunk = JSON.parse(buffer.trim());
        if (
          chunk.choices &&
          chunk.choices[0] &&
          chunk.choices[0].delta &&
          chunk.choices[0].delta.content
        ) {
          observer.next(chunk.choices[0].delta.content);
        }
      } catch (e) {
        observer.error(new Error("Error while processing final chunk"));
      }
    }

    observer.complete();
  };

  return { streamText };
};
