export type AttendanceStatus =
  | "present"
  | "absent"
  | "half_day"
  | "leave"
  | "holiday"
  | "week_off";

export interface AttendanceUser {
  id: number;
  name: string;
  email: string;
}

export interface AttendanceEmployeeProfile {
  id: number;
  employee_code: string;
  user_id: number;
  user?: AttendanceUser;
}

export interface AttendanceShift {
  id: number;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  grace_period_minutes: number;
  minimum_working_hours: string;
  half_day_after_hours?: string | null;
  overtime_eligible: boolean;
  overtime_after_hours?: string | null;
  cross_midnight: boolean;
  is_active: boolean;
  description?: string | null;
}

export interface Attendance {
  id: number;
  employee_profile_id: number;
  shift_id: number | null;
  attendance_date: string;
  check_in_at: string | null;
  check_out_at: string | null;
  working_minutes: number;
  late_minutes: number;
  early_departure_minutes: number;
  overtime_minutes: number;
  status: AttendanceStatus;
  check_in_source: string | null;
  check_out_source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  employee_profile?: AttendanceEmployeeProfile;
  shift?: AttendanceShift | null;
}

export interface AttendanceListResponse {
  success: boolean;
  message: string;
  data: Attendance[];
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: Attendance;
}

export interface MarkAttendanceStatusPayload {
  employee_profile_id: number;
  attendance_date: string;
  status: Exclude<AttendanceStatus, "present">;
  shift_id?: number | null;
  notes?: string | null;
}
