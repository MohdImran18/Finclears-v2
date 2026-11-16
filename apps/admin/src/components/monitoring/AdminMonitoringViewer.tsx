"use client";

import { useEffect, useRef, useState } from "react";
import {
  endEmployeeMonitoringSession,
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
  employeeName: string;
  onEnded: () => void;
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

export default function AdminMonitoringViewer({
  sessionId,
  employeeName,
  onEnded,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState("Connecting to monitoring channel...");
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    mountedRef.current = true;

    const cleanup = () => {
      if (channelRef.current) {
        try {
          channelRef.current.stopListening(".employee.monitoring.signal");
        } catch {}
        channelRef.current = null;
      }

      if (peerRef.current) {
        peerRef.current.ontrack = null;
        peerRef.current.onicecandidate = null;
        peerRef.current.close();
        peerRef.current = null;
      }

      remoteStreamRef.current?.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
      pendingCandidatesRef.current = [];
    };

    const connect = async () => {
      try {
        const token = getAuthToken();
        const currentUserId = getCurrentUserId();

        if (!token || !currentUserId) {
          throw new Error("Admin login session could not be verified.");
        }

        const echo = getEmployeeMonitoringEcho(token);
        const channel = echo.private(
          `employee-monitoring.session.${sessionId}`
        );
        channelRef.current = channel;

        const peer = new RTCPeerConnection({
          iceServers: [
            {
              urls:
                process.env.NEXT_PUBLIC_WEBRTC_STUN_URL ||
                "stun:stun.l.google.com:19302",
            },
          ],
        });

        peerRef.current = peer;

        peer.ontrack = (event) => {
          if (!mountedRef.current) return;

          let stream = event.streams?.[0];

          if (!stream) {
            stream = remoteStreamRef.current || new MediaStream();
            stream.addTrack(event.track);
          }

          remoteStreamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            void videoRef.current.play().catch(() => {
              setStatus("Stream received. Press Play to view video.");
            });
          }
        };

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            void sendEmployeeMonitoringSignal(sessionId, "ice-candidate", {
              candidate: event.candidate.toJSON(),
            }).catch(() => {
              if (mountedRef.current) {
                setError("Unable to send connection information.");
              }
            });
          }
        };

        peer.onconnectionstatechange = () => {
          if (!mountedRef.current) return;

          if (peer.connectionState === "connected") {
            setConnected(true);
            setStatus("Live employee camera stream connected.");
          } else if (peer.connectionState === "connecting") {
            setStatus("Establishing live media connection...");
          } else if (peer.connectionState === "disconnected") {
            setConnected(false);
            setStatus("Media connection interrupted.");
          } else if (peer.connectionState === "failed") {
            setConnected(false);
            setStatus("Media connection failed. Check network or TURN configuration.");
          } else if (peer.connectionState === "closed") {
            setConnected(false);
            setStatus("Media connection closed.");
          }
        };

        channel.listen(
          ".employee.monitoring.signal",
          async (event: SignalEvent) => {
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
              if (event.signal_type === "offer" && event.payload?.sdp) {
                if (activePeer.remoteDescription) return;

                await activePeer.setRemoteDescription({
                  type: "offer",
                  sdp: event.payload.sdp,
                });

                const answer = await activePeer.createAnswer();
                await activePeer.setLocalDescription(answer);

                await sendEmployeeMonitoringSignal(sessionId, "answer", {
                  sdp: activePeer.localDescription?.sdp,
                });

                for (const candidate of pendingCandidatesRef.current) {
                  await activePeer.addIceCandidate(candidate);
                }
                pendingCandidatesRef.current = [];

                if (mountedRef.current) {
                  setStatus("Offer received. Connecting employee camera...");
                }
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
                setError("Unable to negotiate the employee media connection.");
              }
            }
          }
        );

        await new Promise<void>((resolve, reject) => {
          const timeout = window.setTimeout(() => {
            reject(new Error("Realtime channel connection timed out."));
          }, 15000);

          channel.subscribed(() => {
            window.clearTimeout(timeout);
            resolve();
          });

          channel.error(() => {
            window.clearTimeout(timeout);
            reject(new Error("Unable to subscribe to the private monitoring channel."));
          });
        });

        if (mountedRef.current) {
          setStatus("Connected to secure channel. Waiting for employee camera...");
        }
      } catch (err) {
        cleanup();

        if (mountedRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to initialize live monitoring."
          );
          setStatus("Viewer is not connected.");
        }
      }
    };

    void connect();

    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [sessionId]);

  const handleEndSession = async () => {
    if (ending) return;

    setEnding(true);
    setError("");

    try {
      await endEmployeeMonitoringSession(sessionId);
      onEnded();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to end the monitoring session."
      );
      setEnding(false);
    }
  };

  return (
    <section className="rounded-xl border border-red-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-gray-900">
            Live Monitoring: {employeeName}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Session #{sessionId} · Recording disabled
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            connected
              ? "bg-red-100 text-red-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {connected ? "LIVE" : "CONNECTING"}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg bg-gray-950">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="aspect-video w-full object-contain"
        />
        {!connected && (
          <p className="px-3 py-4 text-center text-sm text-gray-300">
            {status}
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">{status}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMuted((current) => !current);
              if (videoRef.current) {
                videoRef.current.muted = !muted;
              }
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {muted ? "Enable Audio" : "Mute Audio"}
          </button>

          <button
            type="button"
            onClick={() => void handleEndSession()}
            disabled={ending}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {ending ? "Ending..." : "End Session"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
