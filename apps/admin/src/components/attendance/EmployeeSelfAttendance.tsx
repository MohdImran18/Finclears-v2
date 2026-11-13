"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  ShieldCheck,
  CalendarDays,
  ScanFace,
  Fingerprint,
  LogIn,
  LogOut,
  Sparkles,
  RotateCcw,
  LockKeyhole,
  Navigation,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { getAttendances } from "@/lib/api/attendance/attendanceApi";
import {
  employeeCheckIn,
  employeeCheckOut,
} from "@/lib/api/attendance/employeeSelfAttendanceApi";
import type { Attendance } from "@/types/attendance/attendance";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatTime(value: string | null) {
  if (!value) return "Not recorded";

  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export default function EmployeeSelfAttendance() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [photo, setPhoto] = useState<Blob | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [locationText, setLocationText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTodayAttendance = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAttendances({ date: getToday() });
      setAttendance(response.data[0] ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodayAttendance();
  }, [loadTodayAttendance]);

  useEffect(() => {
    if (streamActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {
        setError("Unable to start camera preview. Please try again.");
      });
    }
  }, [streamActive]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!photoPreview) return;

    return () => {
      URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  async function startCamera() {
    try {
      setError("");
      setSuccess("");
      setCameraLoading(true);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera is unavailable. Please open this page using HTTPS."
        );
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setStreamActive(true);
      setPhoto(null);
      setPhotoPreview("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setCameraLoading(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStreamActive(false);
  }

  function captureSelfie() {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      setError("Camera is not ready. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture selfie.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Selfie capture failed. Please try again.");
          return;
        }

        if (blob.size > 2 * 1024 * 1024) {
          setError("Selfie is larger than 2 MB. Please capture again.");
          return;
        }

        setPhoto(blob);
        setPhotoPreview(URL.createObjectURL(blob));
        setError("");
        stopCamera();
      },
      "image/jpeg",
      0.82
    );
  }

  function getCurrentLocation(): Promise<{
    latitude: number;
    longitude: number;
    accuracy: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("GPS location is not supported by this browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (locationError) => {
          reject(
            new Error(
              locationError.code === 1
                ? "Location permission denied. Allow location access to mark attendance."
                : locationError.code === 2
                  ? "Your location could not be determined. Please try again."
                  : "Location request timed out. Please try again."
            )
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    });
  }

  async function submitAttendance() {
    if (!photo) {
      setError("Please capture your selfie before continuing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const location = await getCurrentLocation();

      if (location.accuracy > 1000) {
        throw new Error(
          "GPS accuracy is too low. Please move to an open area and try again."
        );
      }

      setLocationText(
        `Location captured (accuracy: ${Math.round(location.accuracy)} metres)`
      );

      const payload = {
        photo,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      };

      if (!attendance?.check_in_at) {
        await employeeCheckIn(payload);
        setSuccess("Your check-in has been recorded successfully.");
      } else if (!attendance.check_out_at) {
        await employeeCheckOut(payload);
        setSuccess("Your check-out has been recorded successfully.");
      } else {
        throw new Error("Today's check-in and check-out are already complete.");
      }

      setPhoto(null);
      setPhotoPreview("");
      await loadTodayAttendance();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const checkedIn = Boolean(attendance?.check_in_at);
  const checkedOut = Boolean(attendance?.check_out_at);

  const actionLabel = !checkedIn
    ? "Check In"
    : !checkedOut
      ? "Check Out"
      : "Attendance Completed";

  const nextAction = !checkedIn
    ? "check-in"
    : !checkedOut
      ? "check-out"
      : "completed";

  return (
    <div className="min-h-screen space-y-6 pb-8">
      {/* Premium header */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-[#101D32] px-6 py-8 text-white shadow-xl shadow-slate-900/10 sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              Employee self-service portal
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Attendance
            </h1>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
              Your workday, recorded securely. Mark attendance with live selfie
              and GPS verification.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-emerald-300" />
                {formatDate()}
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:block" />
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Secure attendance
              </span>
            </div>
          </div>

          <div className="flex min-w-[210px] items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
              {checkedOut ? (
                <CheckCircle2 className="h-7 w-7" />
              ) : (
                <Clock3 className="h-7 w-7" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Today's status
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {loading
                  ? "Loading..."
                  : checkedOut
                    ? "Completed"
                    : checkedIn
                      ? "Checked In"
                      : "Not Checked In"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {checkedOut
                  ? "Have a great day!"
                  : checkedIn
                    ? "Your workday is in progress"
                    : "Ready to start your day?"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Attendance summary */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Today's Overview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your attendance activity for today
            </p>
          </div>

          <button
            type="button"
            onClick={loadTodayAttendance}
            disabled={loading || submitting}
            className="inline-flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-emerald-500/[0.07] transition group-hover:scale-125" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Check-in time
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                  {loading
                    ? "Loading..."
                    : formatTime(attendance?.check_in_at ?? null)}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      checkedIn ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={
                      checkedIn ? "text-emerald-700" : "text-muted-foreground"
                    }
                  >
                    {checkedIn ? "Successfully recorded" : "Awaiting check-in"}
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <LogIn className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-7 -top-7 h-28 w-28 rounded-full bg-blue-500/[0.07] transition group-hover:scale-125" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Check-out time
                </p>
                <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                  {loading
                    ? "Loading..."
                    : formatTime(attendance?.check_out_at ?? null)}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      checkedOut ? "bg-blue-500" : "bg-slate-300"
                    }`}
                  />
                  <span
                    className={
                      checkedOut ? "text-blue-700" : "text-muted-foreground"
                    }
                  >
                    {checkedOut ? "Successfully recorded" : "Not checked out yet"}
                  </span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <LogOut className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main attendance workspace */}
      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        {/* Camera panel */}
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b px-5 py-5 sm:px-7">
            <div>
              <div className="flex items-center gap-2">
                <ScanFace className="h-5 w-5 text-emerald-600" />
                <h2 className="font-bold text-foreground">
                  Attendance Verification
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Capture a fresh selfie to continue
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Secure
            </span>
          </div>

          <div className="p-5 sm:p-7">
            <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl bg-[#101D32]">
              {photoPreview ? (
                <>
                  <img
                    src={photoPreview}
                    alt="Captured attendance selfie"
                    className="aspect-video w-full object-contain"
                  />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Selfie captured
                  </div>
                </>
              ) : streamActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="aspect-video w-full object-cover"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-2 text-xs font-medium text-white backdrop-blur">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
                    Camera is live
                  </div>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[72%] w-[48%] rounded-[48%] border-2 border-dashed border-white/60 shadow-[0_0_0_999px_rgba(0,0,0,0.10)]" />
                  </div>
                </>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center px-5 text-center text-white">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-emerald-300">
                    <Camera className="h-9 w-9" />
                  </div>
                  <p className="text-base font-semibold">
                    Your selfie preview
                  </p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-300">
                    Open your camera and position your face clearly inside the
                    frame.
                  </p>
                </div>
              )}
            </div>

            <div className="mx-auto mt-5 flex max-w-2xl flex-wrap gap-3">
              {!streamActive && !photoPreview && (
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={cameraLoading || loading || submitting || checkedOut}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#176B50] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#12563F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cameraLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  {cameraLoading ? "Opening camera..." : "Open Camera"}
                  {!cameraLoading && <ArrowRight className="h-4 w-4" />}
                </button>
              )}

              {streamActive && (
                <>
                  <button
                    type="button"
                    onClick={captureSelfie}
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#176B50] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#12563F]"
                  >
                    <Camera className="h-4 w-4" />
                    Capture Selfie
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
                  >
                    Cancel
                  </button>
                </>
              )}

              {photoPreview && (
                <>
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={cameraLoading || submitting}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={submitAttendance}
                    disabled={submitting || loading || checkedOut}
                    className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#176B50] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#12563F] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {submitting ? "Verifying..." : actionLabel}
                  </button>
                </>
              )}

              {checkedOut && (
                <div className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                  <CheckCircle2 className="h-5 w-5" />
                  Today's attendance is complete
                </div>
              )}
            </div>

            <div className="mx-auto mt-5 flex max-w-2xl items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  GPS location verification
                </p>
                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Your current location is requested securely when you submit
                  attendance. Please allow location access.
                </p>
                {locationText && (
                  <p className="mt-2 text-xs font-semibold text-blue-900">
                    {locationText}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Verification and timeline sidebar */}
        <div className="space-y-5">
          <div className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="font-bold text-foreground">
                Verification checklist
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Required security checks
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ScanFace className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Live selfie
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fresh camera capture required
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    photo
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {photo ? "Captured" : "Required"}
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    GPS location
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requested during submission
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    locationText
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {locationText ? "Captured" : "Pending"}
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Attendance record
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Server-side timestamp and IP
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    checkedIn
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {checkedIn ? "Recorded" : "On submit"}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
              <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              Your attendance submission requires a selfie and location
              permission.
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-foreground">Today's timeline</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your attendance journey
                </p>
              </div>
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="relative space-y-0">
              <div className="absolute bottom-7 left-[15px] top-7 w-px bg-border" />

              <div className="relative flex gap-3 pb-7">
                <div
                  className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    checkedIn
                      ? "bg-emerald-100 text-emerald-700"
                      : "border bg-card text-muted-foreground"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Check-in
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {checkedIn
                      ? formatTime(attendance?.check_in_at ?? null)
                      : "Waiting for your arrival"}
                  </p>
                </div>
                {checkedIn && (
                  <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                )}
              </div>

              <div className="relative flex gap-3">
                <div
                  className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    checkedOut
                      ? "bg-blue-100 text-blue-700"
                      : "border bg-card text-muted-foreground"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    Check-out
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {checkedOut
                      ? formatTime(attendance?.check_out_at ?? null)
                      : checkedIn
                        ? "Your workday is in progress"
                        : "Available after check-in"}
                  </p>
                </div>
                {checkedOut && (
                  <CheckCircle2 className="mt-1 h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#101D32] p-4 text-white">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Attendance secured
                </span>
              </div>
              <p className="mt-2 text-sm leading-5 text-slate-300">
                {nextAction === "completed"
                  ? "Your attendance for today has been completed successfully."
                  : nextAction === "check-out"
                    ? "Remember to check out before leaving for the day."
                    : "Start your day by recording your check-in."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-center gap-2 pb-2 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4" />
        Secure employee attendance
        <span className="text-border">|</span>
        <span>Selfie & GPS verification</span>
      </div>
    </div>
  );
}
