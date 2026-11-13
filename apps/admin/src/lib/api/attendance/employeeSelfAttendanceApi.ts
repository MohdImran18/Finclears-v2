import type { AttendanceResponse } from "@/types/attendance/attendance";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

async function submitAttendance(
  action: "check-in" | "check-out",
  data: {
    photo: Blob;
    latitude: number;
    longitude: number;
    accuracy: number;
  }
): Promise<AttendanceResponse> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const formData = new FormData();

  formData.append("photo", data.photo, "attendance-selfie.jpg");
  formData.append("latitude", String(data.latitude));
  formData.append("longitude", String(data.longitude));
  formData.append("accuracy", String(data.accuracy));

  const response = await fetch(
    `${API_BASE_URL}/employee/attendance/${action}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || `Attendance request failed (${response.status})`
    );
  }

  return result as AttendanceResponse;
}

export function employeeCheckIn(data: {
  photo: Blob;
  latitude: number;
  longitude: number;
  accuracy: number;
}) {
  return submitAttendance("check-in", data);
}

export function employeeCheckOut(data: {
  photo: Blob;
  latitude: number;
  longitude: number;
  accuracy: number;
}) {
  return submitAttendance("check-out", data);
}
