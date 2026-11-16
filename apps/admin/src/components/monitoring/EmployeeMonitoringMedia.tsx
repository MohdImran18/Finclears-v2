"use client";

import { useEffect, useRef, useState } from "react";
import {
  sendEmployeeMonitoringSignal,
  type EmployeeMonitoringSignalType,
} from "@/lib/api/hrm/hrmApi";
import { getEmployeeMonitoringEcho } from "@/lib/realtime/employeeMonitoringEcho";

type SignalEvent = {
  session_id: number;
  sender_id: number | string;
  signal_type: EmployeeMonitoringSignalType;
  payload: {
    sdp?: string;
    candidate?: RTCIceCandidateInit;
  };
};

type Props = {
  sessionId: number;
};

function getAuthToken(): string {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    ""
  );
}

function getCurrentUserId(): string {
  try {
    const raw = localStorage.getItem("admin_user");
    if (!raw) return "";
    const user = JSON.parse(raw);
    return String(user?.id ?? user?.user_id ?? "");
  } catch {
    return "";
  }
}

export default function EmployeeMonitoringMedia({ sessionId }: Props) {
  const [status, setStatus] = useState("Camera and microphone are not connected.");
  const [starting, setStarting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const channelRef = useRef<any>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const mountedRef = useRef(true);

  const closeMedia = () => {
    if (channelRef.current) {
      try {
        channelRef.current.stopListening(".employee.monitoring.signal");
      } catch {}
      channelRef.current = null;
    }

    if (peerRef.current) {
      peerRef.current.onicecandidate = null;
      peerRef.current.ontrack = null;
      peerRef.current.close();
      peerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    pendingCandidatesRef.current = [];
    setConnected(false);
  };

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      if (channelRef.current) {
        try {
          channelRef.current.stopListening(".employee.monitoring.signal");
        } catch {}
      }

      closeMedia();
    };
  }, []);

  const startMedia = async () => {
    if (starting || peerRef.current) return;

    setStarting(true);
    setError("");

    try {
      if (!window.isSecureContext) {
        throw new Error("Camera access requires HTTPS or localhost.");
      }

      const token = getAuthToken();
      if (!token) {
        throw new Error("Your login session is unavailable. Please sign in again.");
      }

      const currentUserId = getCurrentUserId();
      if (!currentUserId) {
        throw new Error("Unable to verify the signed-in employee account.");
      }

      setStatus("Requesting camera and microphone access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        void localVideoRef.current.play().catch(() => {});
      }

      const echo = getEmployeeMonitoringEcho(token);
      const channel = echo.private(`employee-monitoring.session.${sessionId}`);
      channelRef.current = channel;

      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: process.env.NEXT_PUBLIC_WEBRTC_STUN_URL ||
              "stun:stun.l.google.com:19302",
          },
        ],
      });

      peerRef.current = peer;

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          void sendEmployeeMonitoringSignal(sessionId, "ice-candidate", {
            candidate: event.candidate.toJSON(),
          }).catch(() => {
            if (mountedRef.current) {
              setError("Network issue while sending connection information.");
            }
          });
        }
      };

      peer.onconnectionstatechange = () => {
        if (!mountedRef.current) return;

        const state = peer.connectionState;

        if (state === "connected") {
          setConnected(true);
          setStatus("Camera and microphone are live for the authorized session.");
        } else if (state === "connecting") {
          setStatus("Connecting securely to management...");
        } else if (state === "disconnected") {
          setConnected(false);
          setStatus("Connection interrupted. Trying to recover...");
        } else if (state === "failed") {
          setConnected(false);
          setStatus("Media connection failed. Please contact management.");
        } else if (state === "closed") {
          setConnected(false);
          setStatus("Media connection stopped.");
        }
      };

      channel.listen(".employee.monitoring.signal", async (event: SignalEvent) => {
        if (
          !mountedRef.current ||
          Number(event.session_id) !== sessionId ||
          String(event.sender_id) === currentUserId
        ) {
          return;
        }

        const activePeer = peerRef.current;
        if (!activePeer) return;

        try {
          if (event.signal_type === "answer" && event.payload?.sdp) {
            await activePeer.setRemoteDescription({
              type: "answer",
              sdp: event.payload.sdp,
            });

            for (const candidate of pendingCandidatesRef.current) {
              await activePeer.addIceCandidate(candidate);
            }
            pendingCandidatesRef.current = [];
          }

          if (
            event.signal_type === "ice-candidate" &&
            event.payload?.candidate
          ) {
            if (activePeer.remoteDescription) {
              await activePeer.addIceCandidate(event.payload.candidate);
            } else {
              pendingCandidatesRef.current.push(event.payload.candidate);
            }
          }
        } catch {
          if (mountedRef.current) {
            setError("Unable to process the management connection signal.");
          }
        }
      });

      setStatus("Waiting for secure realtime connection...");

      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          reject(new Error("Realtime connection timed out. Please try again."));
        }, 15000);

        channel.subscribed(() => {
          window.clearTimeout(timeout);
          resolve();
        });

        channel.error(() => {
          window.clearTimeout(timeout);
          reject(new Error("Unable to connect to the monitoring server."));
        });
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      await sendEmployeeMonitoringSignal(sessionId, "offer", {
        sdp: peer.localDescription?.sdp,
      });

      setStatus("Camera is active. Waiting for management to connect...");
    } catch (err) {
      closeMedia();

      const message =
        err instanceof Error ? err.message : "Unable to start camera and microphone.";

      if (mountedRef.current) {
        setError(message);
        setStatus("Camera and microphone are not connected.");
      }
    } finally {
      if (mountedRef.current) setStarting(false);
    }
  };

  const stopMedia = () => {
    if (channelRef.current) {
      try {
        channelRef.current.stopListening(".employee.monitoring.signal");
      } catch {}
      channelRef.current = null;
    }

    closeMedia();
    setStatus("Camera and microphone stopped.");
  };

  return (
    <section className="mt-4 rounded-xl border border-blue-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">
            Camera & Microphone
          </h3>
          <p className="mt-1 text-sm text-gray-600">{status}</p>
        </div>

        {connected && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            LIVE
          </span>
        )}

        {!peerRef.current ? (
          <button
            type="button"
            onClick={() => void startMedia()}
            disabled={starting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {starting ? "Connecting..." : "Start Camera & Microphone"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopMedia}
            className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            Stop Camera
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {streamRef.current && (
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="mt-4 aspect-video w-full max-w-md rounded-lg bg-gray-950 object-contain"
        />
      )}

      <p className="mt-3 text-xs text-gray-500">
        Camera and microphone are used only during the active authorized
        monitoring session. No recording is performed by this component.
      </p>
    </section>
  );
}
