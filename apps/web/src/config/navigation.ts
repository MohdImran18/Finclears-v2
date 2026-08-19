import {
	Building2,
	CreditCard,
	FileText,
	FolderOpen,
	LayoutDashboard,
	Settings,
	User,
} from "lucide-react";

export const sidebarNavigation = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Company",
		href: "/dashboard/company",
		icon: Building2,
	},
	{
		title: "ITR Filing",
		href: "/dashboard/itr",
		icon: FileText,
	},
	{
		title: "Payments",
		href: "/dashboard/payments",
		icon: CreditCard,
	},
	{
		title: "Documents",
		href: "/dashboard/documents",
		icon: FolderOpen,
	},
	{
		title: "Profile",
		href: "/dashboard/profile",
		icon: User,
	},
	{
		title: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
	},
];
