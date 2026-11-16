"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminMonitoringViewer from "@/components/monitoring/AdminMonitoringViewer";
import {
  getEmployeePresence,
  requestEmployeeMonitoringSession,
  type EmployeePresenceItem,
  type EmployeeMonitoringSession,
} from "@/lib/api/hrm/hrmApi";

type PresenceStatus = "online" | "away" | "offline";

function formatLastSeen(value: string | null) {
  if (!value) return "Never seen";

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: PresenceStatus }) {
  const styles: Record<PresenceStatus, string> = {
    online: "bg-green-100 text-green-700",
    away: "bg-amber-100 text-amber-700",
    offline: "bg-gray-100 text-gray-600",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      <span className="mr-1.5">â—</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function EmployeeMonitoringPage() {
  const [employees, setEmployees] = useState<EmployeePresenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [requestingEmployeeId, setRequestingEmployeeId] = useState<number | null>(null);
  const [requestedEmployeeIds, setRequestedEmployeeIds] = useState<number[]>([]);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [activeSession, setActiveSession] = useState<EmployeeMonitoringSession | null>(null);

  const loadPresence = useCallback(async (initial = false) => {
    try {
      if (initial) setLoading(true);
      else setRefreshing(true);

      setError("");
      const response = await getEmployeePresence(100);
      setEmployees(response.data || []);
      setLastUpdated(new Date());
    } catch {
      setError("Unable to load employee presence. Please check your access or API connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRequestMonitoring = async (employee: EmployeePresenceItem) => {
    setRequestingEmployeeId(employee.user_id);
    setRequestMessage("");
    setRequestError("");

    try {
      const response = await requestEmployeeMonitoringSession(employee.user_id);
      setActiveSession(response.data);

      setRequestedEmployeeIds((current) =>
        current.includes(employee.user_id)
          ? current
          : [...current, employee.user_id]
      );

      setRequestMessage(
        `Monitoring session started for ${employee.name || "employee"}. Employee can now enable camera and microphone.`
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Unable to send monitoring request. Please try again.";

      setRequestError(message);
    } finally {
      setRequestingEmployeeId(null);
    }
  };
  useEffect(() => {
    void loadPresence(true);

    const interval = window.setInterval(() => {
      void loadPresence(false);
    }, 30000);

    return () => window.clearInterval(interval);
  }, [loadPresence]);

  const departments = useMemo(
    () => Array.from(
      new Set(employees.map((item) => item.department).filter(Boolean))
    ).sort() as string[],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !term ||
        (employee.name || "").toLowerCase().includes(term) ||
        (employee.employee_code || "").toLowerCase().includes(term) ||
        (employee.email || "").toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "all" || employee.presence_status === statusFilter;

      const matchesDepartment =
        departmentFilter === "all" ||
        employee.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, search, statusFilter, departmentFilter]);

  const counts = useMemo(() => ({
    total: employees.length,
    online: employees.filter((item) => item.presence_status === "online").length,
    away: employees.filter((item) => item.presence_status === "away").length,
    offline: employees.filter((item) => item.presence_status === "offline").length,
  }), [employees]);

  return (
    <main className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Monitoring</h1>
          <p className="mt-1 text-sm text-gray-500">
            Employee online presence and last seen information
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadPresence(false)}
          disabled={refreshing}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {refreshing ? "Refreshing..." : "â†» Refresh"}
        </button>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total Employees", value: counts.total, color: "text-gray-900" },
          { label: "Online", value: counts.online, color: "text-green-600" },
          { label: "Away", value: counts.away, color: "text-amber-600" },
          { label: "Offline", value: counts.offline, color: "text-gray-500" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, employee code or email..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="online">Online</option>
            <option value="away">Away</option>
            <option value="offline">Offline</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
        </div>
      </section>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {requestMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {requestMessage}
        </div>
      )}

      {activeSession && (
        <AdminMonitoringViewer
          sessionId={activeSession.id}
          employeeName={activeSession.employee?.name || "Employee"}
          onEnded={() => {
            setActiveSession(null);
            setRequestMessage("Monitoring session ended successfully.");
            setRequestedEmployeeIds((current) =>
              current.filter((id) => id !== activeSession.employee_user_id)
            );
          }}
        />
      )}
      {requestError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {requestError}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
          <h2 className="font-semibold text-gray-900">Employee Presence</h2>
          <span className="text-xs text-gray-500">
            Auto-refresh: 30 seconds
            {lastUpdated ? ` Â· Updated ${lastUpdated.toLocaleTimeString("en-IN")}` : ""}
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-500">Loading employee presence...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No employee records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Employee Code</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Designation</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Last Seen</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.user_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{employee.name || "Unnamed employee"}</div>
                      <div className="text-xs text-gray-500">{employee.email || "-"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{employee.employee_code || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{employee.department || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{employee.designation || "-"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={employee.presence_status} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatLastSeen(employee.last_seen_at)}
                    </td>
                    <td className="px-4 py-3">
                      {requestedEmployeeIds.includes(employee.user_id) ? (
                        <span className="text-xs font-semibold text-amber-700">
                          Request Sent
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleRequestMonitoring(employee)}
                          disabled={
                            requestingEmployeeId === employee.user_id ||
                            employee.presence_status === "offline"
                          }
                          className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {requestingEmployeeId === employee.user_id
                            ? "Sending..."
                            : "Request Monitoring"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-gray-200 px-4 py-3 text-xs text-gray-500">
          Showing {filteredEmployees.length} of {employees.length} loaded employee records.
        </div>
      </section>
    </main>
  );
}
