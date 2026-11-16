import { post } from "@/lib/request";

export interface EmployeePresenceHeartbeatResponse {
  success: boolean;
  data: {
    status: "online" | "away";
    last_seen_at: string;
    heartbeat_interval_seconds: number;
  };
}

const EmployeePresenceService = {
  heartbeat(active: boolean) {
    return post<EmployeePresenceHeartbeatResponse>(
      "/employee-presence/heartbeat",
      { active }
    );
  },
};

export default EmployeePresenceService;
