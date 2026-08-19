import AccountSettings from "@/components/dashboard/settings/AccountSettings";
import DangerZone from "@/components/dashboard/settings/DangerZone";
import LanguageSettings from "@/components/dashboard/settings/LanguageSettings";
import NotificationSettings from "@/components/dashboard/settings/NotificationSettings";
import PreferenceSettings from "@/components/dashboard/settings/PreferenceSettings";
import SecuritySettings from "@/components/dashboard/settings/SecuritySettings";
import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";
import ThemeSettings from "@/components/dashboard/settings/ThemeSettings";

export default function SettingsPage() {
	return (
		<SettingsLayout>
			<AccountSettings />

			<SecuritySettings />

			<NotificationSettings />

			<PreferenceSettings />

			<ThemeSettings />

			<LanguageSettings />

			<DangerZone />
		</SettingsLayout>
	);
}

