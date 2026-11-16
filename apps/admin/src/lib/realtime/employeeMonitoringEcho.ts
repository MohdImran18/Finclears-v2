"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

type EchoInstance = ReturnType<typeof createEcho>;

let echoInstance: EchoInstance | null = null;
let activeToken: string | null = null;

function createEcho(token: string) {
  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
  const host = process.env.NEXT_PUBLIC_REVERB_HOST || "localhost";
  const port = Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080);
  const scheme = process.env.NEXT_PUBLIC_REVERB_SCHEME || "http";
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000/api/v1";

  if (!key) {
    throw new Error("Reverb app key is not configured.");
  }

  const authEndpoint = new URL(
    "/broadcasting/auth",
    apiUrl
  ).toString();

  (window as typeof window & { Pusher: typeof Pusher }).Pusher = Pusher;

  return new Echo({
    broadcaster: "reverb",
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === "https",
    enabledTransports: scheme === "https" ? ["wss"] : ["ws", "wss"],
    authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });
}

export function getEmployeeMonitoringEcho(token: string) {
  if (typeof window === "undefined") {
    throw new Error("Realtime connection is only available in the browser.");
  }

  if (!token) {
    throw new Error("Authentication token is required.");
  }

  if (echoInstance && activeToken === token) {
    return echoInstance;
  }

  if (echoInstance) {
    echoInstance.disconnect();
  }

  echoInstance = createEcho(token);
  activeToken = token;

  return echoInstance;
}

export function disconnectEmployeeMonitoringEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
    activeToken = null;
  }
}
