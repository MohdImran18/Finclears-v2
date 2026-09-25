"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  FileText,
  RefreshCw,
  Plus,
  ArrowUpRight,
  UserPlus,
  UserCheck,
  UserX,
  UserRoundPlus,
  PackagePlus,
  PenLine,
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Headphones,
  BarChart3,
  Settings,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Activity,
} from "lucide-react";

import { getBlogs } from "@/lib/api/blogs/blogApi";
import { getServices } from "@/lib/api/services/serviceApi";
import { getLeads } from "@/lib/api/leads/leadApi";
import type { Lead } from "@/types/lead/lead";
import { getCustomers } from "@/lib/api/customers/customerApi";
import { getOrders } from "@/lib/api/orders/orderApi";
import { getCompanyPayments } from "@/lib/api/payments/paymentApi";
import { getEmployees } from "@/lib/api/employees/employeeApi";
import {
  getDepartments,
  getDesignations,
} from "@/lib/api/hrm/hrmApi";

import AdminShell from "@/components/layout/AdminShell";

export default function HomePage() {
  const router = useRouter();

  const [leads, setLeads] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [services, setServices] = useState(0);
  const [blogs, setBlogs] = useState(0);
  const [orders, setOrders] = useState(0);
  const [payments, setPayments] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const [activeEmployees, setActiveEmployees] = useState(0);
  const [inactiveEmployees, setInactiveEmployees] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [designationCount, setDesignationCount] = useState(0);
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);

  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        leadRes,
        customerRes,
        serviceRes,
        blogRes,
        orderRes,
        paymentRes,
        employeeRes,
        activeEmployeeRes,
        inactiveEmployeeRes,
        departmentRes,
        designationRes,
      ] = await Promise.all([
        getLeads({
          page: 1,
          per_page: 5,
        }),

        getCustomers({
          page: 1,
          per_page: 1,
        }),

        getServices({}),

        getBlogs({}),

        getOrders({
          page: 1,
          per_page: 1,
        }),

        getCompanyPayments({
          page: 1,
          per_page: 100,
        }),

        getEmployees({
          page: 1,
          per_page: 5,
        }),

        getEmployees({
          page: 1,
          per_page: 1,
          status: "active",
        }),

        getEmployees({
          page: 1,
          per_page: 1,
          status: "inactive",
        }),

        getDepartments(),

        getDesignations(),
      ]);

      const leadData = leadRes?.data;
      const customerData = customerRes?.data;
      const serviceData = serviceRes?.data;
      const blogData = blogRes?.data;
      const orderData = orderRes?.data;
      const paymentData = paymentRes?.data;

      const employeeData = employeeRes?.data;
      const activeEmployeeData = activeEmployeeRes?.data;
      const inactiveEmployeeData = inactiveEmployeeRes?.data;

      const departmentData = departmentRes?.data ?? [];
      const designationData = designationRes?.data ?? [];

      setTotalEmployees(employeeData?.total ?? 0);
      setActiveEmployees(activeEmployeeData?.total ?? 0);
      setInactiveEmployees(inactiveEmployeeData?.total ?? 0);

      setDepartmentCount(departmentData.length);
      setDesignationCount(designationData.length);

      setRecentEmployees(employeeData?.data ?? []);

      setLeads(leadData?.total ?? 0);
      setCustomers(customerData?.total ?? 0);
      setServices(serviceData?.services?.length ?? 0);
      setBlogs(blogData?.blogs?.length ?? 0);
      setOrders(orderRes?.meta?.total ?? 0);
      setPayments(paymentData?.length ?? 0);
      setRevenue(
        (paymentData ?? []).reduce(
          (sum, payment) =>
            payment.payment_status === "success"
              ? sum + Number(payment.amount || 0)
              : sum,
          0
        )
      );
      setRecentLeads(leadData?.data ?? []);
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AdminShell>
      <main className="dashboard">

        <style jsx>{`

          .dashboard {
            min-height: calc(100vh - 70px);
            padding: 30px 34px 42px;
            background:
              radial-gradient(
                circle at 92% -10%,
                rgba(37, 99, 235, 0.075),
                transparent 34%
              ),
              linear-gradient(
                180deg,
                #f7faff 0%,
                #f5f8fc 100%
              );
            color: #122a49;
          }

          .container {
            width: 100%;
            max-width: 1480px;
            margin: 0 auto;
          }

          /* HERO */

          .hero {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 25px;
            margin-bottom: 25px;
          }

          .heroLeft {
            min-width: 0;
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            color: #2563eb;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          .eyebrowDot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #2563eb;
            box-shadow:
              0 0 0 4px rgba(37,99,235,.09);
          }

          .title {
            margin: 0;
            color: #102a50;
            font-size: 31px;
            line-height: 1.15;
            font-weight: 800;
            letter-spacing: -.035em;
          }

          .subtitle {
            margin: 7px 0 0;
            color: #71839b;
            font-size: 12px;
            line-height: 1.5;
          }

          .heroActions {
            display: flex;
            align-items: center;
            gap: 9px;
            flex-shrink: 0;
          }

          .btn {
            height: 40px;
            padding: 0 14px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            border: 1px solid #dbe5f1;
            border-radius: 9px;
            background: #fff;
            color: #40536d;
            font-size: 11px;
            font-weight: 750;
            cursor: pointer;
            box-shadow: 0 3px 12px rgba(20,55,100,.035);
            transition: all .18s ease;
          }

          .btn:hover {
            transform: translateY(-1px);
            border-color: #c6d5e8;
            box-shadow: 0 8px 20px rgba(20,55,100,.07);
          }

          .btnPrimary {
            color: #fff;
            border-color: #2563eb;
            background: linear-gradient(
              135deg,
              #2563eb 0%,
              #1d4ed8 100%
            );
            box-shadow:
              0 7px 17px rgba(37,99,235,.22);
          }

          .btnPrimary:hover {
            color: #fff;
            border-color: #1d4ed8;
            box-shadow:
              0 10px 23px rgba(37,99,235,.29);
          }

          /* KPI */

          .kpis {
            display: grid;
            grid-template-columns: repeat(7, minmax(0, 1fr));
            gap: 14px;
            margin-bottom: 16px;
          }

          .kpi {
            position: relative;
            min-height: 132px;
            padding: 19px 20px;
            overflow: hidden;
            border: 1px solid #dfe8f3;
            border-radius: 13px;
            background: rgba(255,255,255,.96);
            text-align: left;
            cursor: pointer;
            box-shadow:
              0 4px 16px rgba(31,67,110,.04);
            transition:
              transform .18s ease,
              box-shadow .18s ease,
              border-color .18s ease;
          }

          .kpi::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: #2563eb;
            opacity: .8;
          }

          .kpi::after {
            content: "";
            position: absolute;
            right: -35px;
            bottom: -48px;
            width: 115px;
            height: 115px;
            border-radius: 50%;
            background: rgba(37,99,235,.035);
          }

          .kpi:hover {
            transform: translateY(-2px);
            border-color: #c7d8ee;
            box-shadow:
              0 12px 27px rgba(31,67,110,.085);
          }

          .kpiTop {
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .kpiLabel {
            color: #647892;
            font-size: 11px;
            font-weight: 700;
          }

          .kpiIcon {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            color: #2563eb;
            background: #eff6ff;
          }

          .kpiValue {
            position: relative;
            z-index: 1;
            margin-top: 16px;
            color: #102b4d;
            font-size: 28px;
            line-height: 1;
            font-weight: 800;
            letter-spacing: -.035em;
          }

          .kpiHint {
            position: relative;
            z-index: 1;
            margin-top: 8px;
            color: #98a7ba;
            font-size: 9px;
          }

          /* GRID */

          .mainGrid {
            display: grid;
            grid-template-columns:
              minmax(0, 1.72fr)
              minmax(330px, .88fr);
            gap: 16px;
            margin-bottom: 16px;
          }

          .card {
            overflow: hidden;
            border: 1px solid #dfe8f2;
            border-radius: 14px;
            background: #fff;
            box-shadow:
              0 4px 16px rgba(31,67,110,.035);
          }

          .cardHeader {
            min-height: 68px;
            padding: 14px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #edf2f7;
          }

          .cardTitleWrap {
            display: flex;
            align-items: center;
            gap: 11px;
          }

          .sectionIcon {
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            color: #2563eb;
            background: #eff6ff;
          }

          .cardTitle {
            margin: 0;
            color: #183454;
            font-size: 12px;
            font-weight: 800;
          }

          .cardSubtitle {
            margin: 3px 0 0;
            color: #9aa8b9;
            font-size: 9px;
          }

          .linkButton {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 5px;
            border: 0;
            background: transparent;
            color: #2563eb;
            font-size: 10px;
            font-weight: 800;
            cursor: pointer;
          }

          .linkButton:hover {
            text-decoration: underline;
          }

          /* LEADS */

          .leadHeader,
          .leadRow {
            display: grid;
            grid-template-columns:
              1.45fr
              1fr
              .75fr
              .62fr;
            align-items: center;
            column-gap: 14px;
          }

          .leadHeader {
            min-height: 36px;
            padding: 0 18px;
            background: #f8fafc;
            color: #8b9aae;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .09em;
            text-transform: uppercase;
          }

          .leadRow {
            width: 100%;
            min-height: 68px;
            padding: 0 18px;
            border: 0;
            border-bottom: 1px solid #edf2f7;
            background: #fff;
            text-align: left;
            cursor: pointer;
            transition: background .15s ease;
          }

          .leadRow:last-child {
            border-bottom: 0;
          }

          .leadRow:hover {
            background: #f8fbff;
          }

          .leadName {
            color: #163353;
            font-size: 11px;
            font-weight: 800;
          }

          .leadMeta {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-top: 4px;
            color: #9aaabd;
            font-size: 9px;
          }

          .muted {
            color: #71839a;
            font-size: 9px;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 21px;
            padding: 0 8px;
            border: 1px solid #c9dcff;
            border-radius: 999px;
            background: #eff6ff;
            color: #2563eb;
            font-size: 8px;
            font-weight: 800;
          }

          .empty {
            min-height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            font-size: 11px;
          }

          /* QUICK ACTIONS */

          .quickGrid {
            padding: 14px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0,1fr));
            gap: 9px;
          }

          .quick {
            min-height: 68px;
            padding: 11px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid #e1e9f3;
            border-radius: 10px;
            background: #fbfdff;
            text-align: left;
            cursor: pointer;
            transition: all .18s ease;
          }

          .quick:hover {
            transform: translateY(-1px);
            border-color: #bfd2ee;
            background: #f7faff;
            box-shadow:
              0 7px 18px rgba(37,99,235,.07);
          }

          .quickIcon {
            width: 33px;
            height: 33px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #d8e7ff;
            border-radius: 9px;
            color: #2563eb;
            background: #eff6ff;
          }

          .quickTitle {
            color: #173455;
            font-size: 10px;
            font-weight: 800;
          }

          .quickText {
            margin-top: 3px;
            color: #94a3b8;
            font-size: 8px;
          }

          /* HRM OVERVIEW */

          .recentEmployeesCard {
            margin-top: 14px;
            overflow: hidden;
          }

          .recentEmployeesTableWrap {
            width: 100%;
            overflow-x: auto;
          }

          .recentEmployeesTable {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          .recentEmployeesTable th {
            padding: 10px 14px;
            text-align: left;
            color: #94a3b8;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border-bottom: 1px solid #eef2f7;
            white-space: nowrap;
          }

          .recentEmployeesTable td {
            padding: 11px 14px;
            color: #193757;
            font-size: 10px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .recentEmployeesTable tbody tr:last-child td {
            border-bottom: 0;
          }

          .recentEmployeesTable tbody tr:hover {
            background: #f8fbff;
          }

          .employeeNameCell {
            display: flex;
            align-items: center;
            gap: 9px;
            min-width: 180px;
          }

          .employeeAvatar {
            width: 28px;
            height: 28px;
            flex: 0 0 28px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #eff6ff;
            color: #2563eb;
            font-size: 10px;
            font-weight: 800;
          }

          .employeeNameWrap {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .employeeName {
            color: #17385d;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .employeeEmail {
            color: #94a3b8;
            font-size: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .employeeIdBadge {
            display: inline-flex;
            align-items: center;
            padding: 4px 7px;
            border-radius: 6px;
            background: #f8fafc;
            border: 1px solid #e5eaf0;
            color: #475569;
            font-size: 8px;
            font-weight: 700;
            white-space: nowrap;
          }

          .employeeDepartment,
          .employeeDesignation {
            color: #475569;
            font-size: 9px;
            font-weight: 600;
          }

          .employeeStatus {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 8px;
            font-weight: 800;
            white-space: nowrap;
          }

          .employeeStatus.active {
            background: #ecfdf5;
            color: #047857;
          }

          .employeeStatus.inactive {
            background: #fef2f2;
            color: #b91c1c;
          }

          .employeeStatusDot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: currentColor;
          }

          .recentEmployeesFooter {
            display: flex;
            justify-content: flex-end;
            padding: 10px 14px;
            border-top: 1px solid #eef2f7;
          }

          .recentEmployeesViewAll {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            border: 0;
            background: transparent;
            color: #2563eb;
            font-size: 9px;
            font-weight: 800;
            cursor: pointer;
          }

          .recentEmployeesViewAll:hover {
            color: #1d4ed8;
          }
          .hrmOverviewCard {
            margin-bottom: 13px;
          }

          .hrmStats {
            padding: 14px;
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 9px;
          }

          .hrmStat {
            min-height: 72px;
            padding: 11px;
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid #e3eaf3;
            border-radius: 10px;
            background: #fff;
            text-align: left;
            cursor: pointer;
            transition: all .18s ease;
          }

          .hrmStat:hover {
            transform: translateY(-1px);
            border-color: #bfd2ee;
            background: #f8fbff;
          }

          .hrmStatIcon {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f1f6fd;
            color: #315b8a;
            flex-shrink: 0;
          }

          .hrmStatLabel {
            color: #8c9bad;
            font-size: 7px;
            font-weight: 700;
          }

          .hrmStatValue {
            margin-top: 3px;
            color: #193757;
            font-size: 18px;
            line-height: 1;
            font-weight: 800;
          }

          .hrmFooter {
            padding: 0 14px 14px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .hrmFooterText {
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .hrmFooterText strong {
            color: #193757;
            font-size: 9px;
            font-weight: 800;
          }

          .hrmFooterText span {
            color: #94a3b8;
            font-size: 7px;
          }

          .hrmActions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            justify-content: flex-end;
          }

          .hrmActionBtn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 7px 9px;
            border: 1px solid #e3eaf3;
            border-radius: 7px;
            background: #fff;
            color: #315b8a;
            font-size: 7px;
            font-weight: 700;
            cursor: pointer;
          }

          .hrmActionBtn:hover {
            background: #f8fbff;
            border-color: #bfd2ee;
          }
          /* MODULES */

          .modulesCard {
            margin-bottom: 13px;
          }

          .modules {
            padding: 14px;
            display: grid;
            grid-template-columns: repeat(5, minmax(0,1fr));
            gap: 9px;
          }

          .module {
            min-height: 63px;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 9px;
            border: 1px solid #e3eaf3;
            border-radius: 10px;
            background: #fff;
            text-align: left;
            cursor: pointer;
            transition: all .18s ease;
          }

          .module:hover:not(:disabled) {
            transform: translateY(-1px);
            border-color: #bfd2ee;
            background: #f8fbff;
          }

          .module:disabled {
            cursor: default;
          }

          .module.coming {
            background: #fbfcfe;
            opacity: .55;
          }

          .moduleIcon {
            width: 32px;
            height: 32px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            color: #2563eb;
            background: #eff6ff;
          }

          .moduleName {
            color: #193757;
            font-size: 9px;
            font-weight: 800;
          }

          .moduleStatus {
            margin-top: 3px;
            color: #9aa8b9;
            font-size: 7px;
          }

          /* FOOTER */

          .footerInfo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2px 2px;
            color: #93a2b4;
            font-size: 8px;
          }

          .statusOnline {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .onlineDot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #16a34a;
            box-shadow:
              0 0 0 4px rgba(22,163,74,.08);
          }

          /* RESPONSIVE */

          @media (max-width: 1200px) {
            .modules {
              grid-template-columns: repeat(3, minmax(0,1fr));
            }

            .mainGrid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 900px) {
            .dashboard {
              padding: 24px 18px 34px;
            }

            .hero {
              align-items: flex-start;
              flex-direction: column;
            }

            .heroActions {
              width: 100%;
            }

            .heroActions .btn {
              flex: 1;
            }

            .kpis {
              grid-template-columns: repeat(2, minmax(0,1fr));
            }
          }

          @media (max-width: 620px) {
            .dashboard {
              padding: 20px 14px 30px;
            }

            .title {
              font-size: 27px;
            }

            .kpis {
              grid-template-columns: 1fr;
            }

            .leadHeader {
              display: none;
            }

            .leadRow {
              grid-template-columns: 1fr;
              row-gap: 6px;
              padding: 14px 16px;
            }

            .quickGrid,
            .modules {
              grid-template-columns: 1fr;
            }

            .footerInfo {
              flex-direction: column;
              align-items: flex-start;
              gap: 7px;
            }
          }

        `}


</style>

        <div className="container">

          {/* HERO */}

          <header className="hero">

            <div className="heroLeft">

              <div className="eyebrow">
                <span className="eyebrowDot" />
                Finclears Admin
              </div>

              <h1 className="title">
                Good afternoon, Admin
              </h1>

              <p className="subtitle">
                Manage your CRM, services and website operations from one place.
              </p>

            </div>

            <div className="heroActions">

              <button
                type="button"
                className="btn"
                onClick={loadDashboard}
              >
                <RefreshCw size={13} />
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <button
                type="button"
                className="btn btnPrimary"
                onClick={() =>
                  router.push("/crm/leads/create")
                }
              >
                <Plus size={15} />
                Add Lead
              </button>

            </div>

          </header>

          {/* KPI CARDS */}

          <section className="kpis">

            <KpiCard
              title="Total Leads"
              value={loading ? "—" : leads}
              hint="CRM leads"
              icon={<Users size={18} />}
              onClick={() =>
                router.push("/crm/leads")
              }
            />

            <KpiCard
              title="Customers"
              value={loading ? "—" : customers}
              hint="CRM customers"
              icon={<UserRound size={18} />}
              onClick={() =>
                router.push("/crm/customers")
              }
            />

            <KpiCard
              title="Services"
              value={loading ? "—" : services}
              hint="Website services"
              icon={<BriefcaseBusiness size={18} />}
              onClick={() =>
                router.push("/services")
              }
            />

            <KpiCard
              title="Blogs"
              value={loading ? "—" : blogs}
              hint="Website content"
              icon={<FileText size={18} />}
              onClick={() =>
                router.push("/blogs")
              }
            />

            <KpiCard
              title="Orders"
              value={loading ? "—" : orders}
              hint="Total orders"
              icon={<ShoppingCart size={18} />}
              onClick={() =>
                router.push("/crm/orders")
              }
            />

            <KpiCard
              title="Payments"
              value={loading ? "—" : payments}
              hint="Payment transactions"
              icon={<CreditCard size={18} />}
              onClick={() =>
                router.push("/crm/payments")
              }
            />

            <KpiCard
              title="Revenue"
              value={
                loading
                  ? "—"
                  : `₹${revenue.toLocaleString("en-IN")}`
              }
              hint="Successful payments"
              icon={<CreditCard size={18} />}
              onClick={() =>
                router.push("/crm/payments")
              }
            />

          </section>

          {/* MAIN */}

          <section className="mainGrid">

            {/* RECENT LEADS */}

            <div className="card">

              <div className="cardHeader">

                <div className="cardTitleWrap">

                  <div className="sectionIcon">
                    <Activity size={16} />
                  </div>

                  <div>
                    <h2 className="cardTitle">
                      Recent Leads
                    </h2>

                    <p className="cardSubtitle">
                      Latest CRM activity
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="linkButton"
                  onClick={() =>
                    router.push("/crm/leads")
                  }
                >
                  View all
                  <ArrowUpRight size={12} />
                </button>

              </div>

              {recentLeads.length === 0 ? (

                <div className="empty">
                  {loading
                    ? "Loading leads..."
                    : "No leads found."}
                </div>

              ) : (

                <>
                  <div className="leadHeader">
                    <div>Lead</div>
                    <div>Source</div>
                    <div>Status</div>
                    <div>Priority</div>
                  </div>

                  {recentLeads.map((lead) => (

                    <button
                      key={lead.id}
                      type="button"
                      className="leadRow"
                      onClick={() =>
                        router.push(
                          `/crm/leads/${lead.id}/edit`
                        )
                      }
                    >

                      <div>

                        <div className="leadName">
                          {lead.name ||
                            lead.company_name ||
                            "Unnamed Lead"}
                        </div>

                        <div className="leadMeta">

                          {lead.email ? (
                            <>
                              <Mail size={10} />
                              {lead.email}
                            </>
                          ) : (
                            <>
                              <Phone size={10} />
                              {lead.phone ||
                                "No contact"}
                            </>
                          )}

                        </div>

                      </div>

                      <div className="muted">
                        {lead.source?.name ||
                          "Direct"}
                      </div>

                      <div>
                        <span className="badge">
                          {lead.status || "New"}
                        </span>
                      </div>

                      <div className="muted">
                        {lead.priority || "Normal"}
                      </div>

                    </button>

                  ))}

                </>

              )}

            </div>

            {/* QUICK ACTIONS */}

            <div className="card">

              <div className="cardHeader">

                <div className="cardTitleWrap">

                  <div className="sectionIcon">
                    <Plus size={16} />
                  </div>

                  <div>
                    <h2 className="cardTitle">
                      Quick Actions
                    </h2>

                    <p className="cardSubtitle">
                      Common admin tasks
                    </p>
                  </div>

                </div>

              </div>

              <div className="quickGrid">

                <QuickAction
                  icon={<UserPlus size={15} />}
                  title="Add Lead"
                  text="Create CRM lead"
                  onClick={() =>
                    router.push(
                      "/crm/leads/create"
                    )
                  }
                />

                <QuickAction
                  icon={<UserRoundPlus size={15} />}
                  title="Add Customer"
                  text="Create customer"
                  onClick={() =>
                    router.push(
                      "/crm/customers/create"
                    )
                  }
                />

                <QuickAction
                  icon={<PackagePlus size={15} />}
                  title="Add Service"
                  text="Create website service"
                  onClick={() =>
                    router.push(
                      "/services/create"
                    )
                  }
                />

                <QuickAction
                  icon={<PenLine size={15} />}
                  title="Create Blog"
                  text="Publish new content"
                  onClick={() =>
                    router.push(
                      "/blogs/create"
                    )
                  }
                />

              </div>

            </div>

          </section>

          {/* HRM OVERVIEW */}

          <section className="card hrmOverviewCard">

            <div className="cardHeader">

              <div className="cardTitleWrap">

                <div className="sectionIcon">
                  <Building2 size={16} />
                </div>

                <div>
                  <h2 className="cardTitle">
                    HRM Overview
                  </h2>

                  <p className="cardSubtitle">
                    Employee and workforce management
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="linkButton"
                onClick={() =>
                  router.push("/crm/employees")
                }
              >
                View employees
                <ArrowUpRight size={12} />
              </button>

            </div>

            <div className="hrmStats">

              <button
                type="button"
                className="hrmStat"
                onClick={() =>
                  router.push("/crm/employees")
                }
              >
                <div className="hrmStatIcon">
                  <Users size={15} />
                </div>

                <div>
                  <div className="hrmStatLabel">
                    Total Employees
                  </div>

                  <div className="hrmStatValue">
                    {totalEmployees}
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="hrmStat"
                onClick={() =>
                  router.push("/crm/employees")
                }
              >
                <div className="hrmStatIcon">
                  <UserCheck size={15} />
                </div>

                <div>
                  <div className="hrmStatLabel">
                    Active Employees
                  </div>

                  <div className="hrmStatValue">
                    {activeEmployees}
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="hrmStat"
                onClick={() =>
                  router.push("/crm/employees")
                }
              >
                <div className="hrmStatIcon">
                  <UserX size={15} />
                </div>

                <div>
                  <div className="hrmStatLabel">
                    Inactive Employees
                  </div>

                  <div className="hrmStatValue">
                    {inactiveEmployees}
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="hrmStat"
                onClick={() =>
                  router.push("/hrm/departments")
                }
              >
                <div className="hrmStatIcon">
                  <Building2 size={15} />
                </div>

                <div>
                  <div className="hrmStatLabel">
                    Departments
                  </div>

                  <div className="hrmStatValue">
                    {departmentCount}
                  </div>
                </div>
              </button>

              <button
                type="button"
                className="hrmStat"
                onClick={() =>
                  router.push("/hrm/designations")
                }
              >
                <div className="hrmStatIcon">
                  <BriefcaseBusiness size={15} />
                </div>

                <div>
                  <div className="hrmStatLabel">
                    Designations
                  </div>

                  <div className="hrmStatValue">
                    {designationCount}
                  </div>
                </div>
              </button>

            </div>

            <div className="hrmFooter">

              <div className="hrmFooterText">
                <strong>HRM</strong>
                <span>
                  Manage employees, departments and designations
                </span>
              </div>

              <div className="hrmActions">

                <button
                  type="button"
                  className="hrmActionBtn"
                  onClick={() =>
                    router.push("/crm/employees/create")
                  }
                >
                  <UserPlus size={13} />
                  Add Employee
                </button>

                <button
                  type="button"
                  className="hrmActionBtn"
                  onClick={() =>
                    router.push("/hrm/departments")
                  }
                >
                  <Building2 size={13} />
                  Departments
                </button>

                <button
                  type="button"
                  className="hrmActionBtn"
                  onClick={() =>
                    router.push("/hrm/designations")
                  }
                >
                  <BriefcaseBusiness size={13} />
                  Designations
                </button>

              </div>

            </div>

          </section>
          {/* RECENT EMPLOYEES */}

          <section className="card recentEmployeesCard">

            <div className="cardHeader">

              <div className="cardTitleWrap">

                <div className="sectionIcon">
                  <Users size={16} />
                </div>

                <div>
                  <h2 className="cardTitle">
                    Recent Employees
                  </h2>

                  <p className="cardSubtitle">
                    Latest employees added to the workforce
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="linkButton"
                onClick={() =>
                  router.push("/crm/employees")
                }
              >
                View all
                <ArrowUpRight size={12} />
              </button>

            </div>

            {recentEmployees.length > 0 ? (

              <div className="recentEmployeesTableWrap">

                <table className="recentEmployeesTable">

                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Employee ID</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                                    <tbody>
                    {recentEmployees.slice(0, 5).map(
                      (employee: any, index: number) => {
                        const employeeName =
                          employee.user?.name ||
                          employee.name ||
                          "Unnamed Employee";

                        const employeeEmail =
                          employee.user?.email ||
                          employee.email ||
                          "";

                        const employeeId =
                          employee.employee_id ||
                          employee.employee_code ||
                          employee.id ||
                          `EMP-${index + 1}`;

                        const department =
                          employee.department?.name ||
                          employee.department_name ||
                          "—";

                        const designation =
                          employee.designation?.name ||
                          employee.designation_name ||
                          "—";

                        const isActive =
                          employee.status === true ||
                          employee.status === "active" ||
                          employee.status === 1;

                        const initials = employeeName
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part: string) => part.charAt(0))
                          .join("")
                          .toUpperCase();

                        return (
                          <tr key={employee.id ?? index}>

                            <td>
                              <div className="employeeNameCell">

                                <div className="employeeAvatar">
                                  {initials || "E"}
                                </div>

                                <div className="employeeNameWrap">

                                  <div className="employeeName">
                                    {employeeName}
                                  </div>

                                  {employeeEmail && (
                                    <div className="employeeEmail">
                                      {employeeEmail}
                                    </div>
                                  )}

                                </div>

                              </div>
                            </td>

                            <td>
                              <span className="employeeIdBadge">
                                {employeeId}
                              </span>
                            </td>

                            <td>
                              <span className="employeeDepartment">
                                {department}
                              </span>
                            </td>

                            <td>
                              <span className="employeeDesignation">
                                {designation}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`employeeStatus ${
                                  isActive
                                    ? "active"
                                    : "inactive"
                                }`}
                              >
                                <span className="employeeStatusDot" />
                                {isActive ? "Active" : "Inactive"}
                              </span>
                            </td>

                          </tr>
                        );
                      }
                    )}
                  </tbody>

                </table>

                <div className="recentEmployeesFooter">

                  <button
                    type="button"
                    className="recentEmployeesViewAll"
                    onClick={() =>
                      router.push("/crm/employees")
                    }
                  >
                    View all employees
                    <ArrowUpRight size={11} />
                  </button>

                </div>

              </div>

            ) : (

              <div className="recentEmployeesEmpty">
                No employees found.
              </div>

            )}

          </section>
          {/* MODULES */}

          <section className="card modulesCard">

            <div className="cardHeader">

              <div className="cardTitleWrap">

                <div className="sectionIcon">
                  <LayoutDashboard size={16} />
                </div>

                <div>
                  <h2 className="cardTitle">
                    Admin Modules
                  </h2>

                  <p className="cardSubtitle">
                    Manage the Finclears platform
                  </p>
                </div>

              </div>

            </div>

            <div className="modules">

              <Module
                name="CRM"
                status="Leads & Customers"
                icon={<Users size={15} />}
                onClick={() =>
                  router.push("/crm/leads")
                }
              />

              <Module
                name="Services"
                status="Service management"
                icon={<BriefcaseBusiness size={15} />}
                onClick={() =>
                  router.push("/services")
                }
              />

              <Module
                name="HRM"
                status="Employees & HR management"
                icon={<Building2 size={15} />}
                onClick={() =>
                  router.push("/hrm/departments")
                }
              />

              <Module
                name="Blogs"
                status="Content management"
                icon={<FileText size={15} />}
                onClick={() =>
                  router.push("/blogs")
                }
              />

              <Module
                name="Orders"
                status="Order management"
                icon={<ShoppingCart size={15} />}
                onClick={() =>
                  router.push("/crm/orders")
                }
              />

              <Module
                name="Payments"
                status="Payment management"
                icon={<CreditCard size={15} />}
                onClick={() =>
                  router.push("/crm/payments")
                }
              />

              <Module
                name="CA Operations"
                status="Coming soon"
                icon={<BriefcaseBusiness size={15} />}
              />

              <Module
                name="Support"
                status="Coming soon"
                icon={<Headphones size={15} />}
              />

              <Module
                name="Reports"
                status="Coming soon"
                icon={<BarChart3 size={15} />}
              />

              <Module
                name="Users & Roles"
                status="Coming soon"
                icon={<ShieldCheck size={15} />}
              />

              <Module
                name="Settings"
                status="Coming soon"
                icon={<Settings size={15} />}
              />

            </div>

          </section>

          {/* FOOTER */}

          <div className="footerInfo">

            <span className="statusOnline">
              <span className="onlineDot" />
              Admin system connected
            </span>

            <span>
              Finclears Admin • CRM & Operations
            </span>

          </div>

        </div>

      </main>
    </AdminShell>
  );
}


/* =========================
   KPI CARD
========================= */

function KpiCard({
  title,
  value,
  hint,
  icon,
  onClick,
}: {
  title: string;
  value: string | number;
  hint: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="kpi"
      onClick={onClick}
    >

      <div className="kpiTop">

        <span className="kpiLabel">
          {title}
        </span>

        <span className="kpiIcon">
          {icon}
        </span>

      </div>

      <div className="kpiValue">
        {value}
      </div>

      <div className="kpiHint">
        {hint}
      </div>

    </button>
  );
}


/* =========================
   QUICK ACTION
========================= */

function QuickAction({
  title,
  text,
  icon,
  onClick,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="quick"
      onClick={onClick}
    >

      <span className="quickIcon">
        {icon}
      </span>

      <span>

        <div className="quickTitle">
          {title}
        </div>

        <div className="quickText">
          {text}
        </div>

      </span>

    </button>
  );
}


/* =========================
   MODULE
========================= */

function Module({
  name,
  status,
  icon,
  onClick,
}: {
  name: string;
  status: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`module ${
        !onClick ? "coming" : ""
      }`}
      onClick={onClick}
      disabled={!onClick}
    >

      <span className="moduleIcon">
        {icon}
      </span>

      <span>

        <div className="moduleName">
          {name}
        </div>

        <div className="moduleStatus">
          {status}
        </div>

      </span>

    </button>
  );
}



















