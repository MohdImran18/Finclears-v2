"use client";

import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  FileText,
  ShoppingCart,
  CreditCard,
  Headphones,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Leads", href: "/crm/leads", icon: Users },
  { label: "Customers", href: "/crm/customers", icon: Users },
  { label: "Services", href: "/services", icon: BriefcaseBusiness },
  { label: "Blogs", href: "/blogs", icon: FileText },
  { label: "Orders", href: "#", icon: ShoppingCart, coming: true },
  { label: "Payments", href: "#", icon: CreditCard, coming: true },
  { label: "Support", href: "#", icon: Headphones, coming: true },
  { label: "Reports", href: "#", icon: BarChart3, coming: true },
  { label: "Users & Roles", href: "#", icon: ShieldCheck, coming: true },
  { label: "Settings", href: "#", icon: Settings, coming: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="adminSidebar">
      <div className="sidebarBrand">
        <div className="brandMark">F</div>

        <div>
          <div className="brandName">Finclears</div>
          <div className="brandLabel">ADMIN PANEL</div>
        </div>
      </div>

      <nav className="sidebarNav">
        <div className="navSectionLabel">WORKSPACE</div>

        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active =
            item.href !== "#" &&
            (pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(item.href)));

          return (
            <button
              key={item.label}
              type="button"
              className={`navItem ${active ? "active" : ""}`}
              onClick={() => item.href !== "#" && router.push(item.href)}
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="navSectionLabel secondary">OPERATIONS</div>

        {items.slice(5).map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              disabled={item.coming}
              className={`navItem ${item.coming ? "coming" : ""}`}
              onClick={() => item.href !== "#" && router.push(item.href)}
            >
              <Icon size={17} />
              <span>{item.label}</span>

              {item.coming && (
                <small>SOON</small>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebarFooter">
        <div className="securityIcon">
          <ShieldCheck size={16} />
        </div>

        <div>
          <strong>Admin Access</strong>
          <span>Secure workspace</span>
        </div>
      </div>
    </aside>
  );
}

