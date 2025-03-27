import { EphemeralToken } from "./types";
import { APIKA_SERVICE_URL } from "../constants";

export function isAsync(fn: Function) {
  return fn.constructor.name === "AsyncFunction";
}

export async function requestLiveSessionEphemeralToken(additionalSetup: {
  voice: string;
  instructions: string;
  tools: object;
  tool_choice: string;
  turn_detection: {
    type: string;
    silence_duration_ms: number;
  };
  modalities: string[];
}) {
  try {
    const base64Data = window.btoa(JSON.stringify(additionalSetup));

    const r = await fetch(
      `${APIKA_SERVICE_URL}/api/get-token?` + "data=" + base64Data
    );

    if (r.status < 200 || r.status >= 299) {
      const body = await r.json();
      console.error("Failed to create the live session", body);
      throw new Error(`Failed to create the live session, status: ${r.status}`);
    }

    const ephemeralToken = (await r.json()) as EphemeralToken;
    return ephemeralToken;
  } catch (error) {
    throw new Error("Failed to create the live session");
  }
}
