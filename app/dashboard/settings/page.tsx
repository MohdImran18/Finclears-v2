import SettingsLayout from "@/components/dashboard/settings/SettingsLayout";
import AccountSettings from "@/components/dashboard/settings/AccountSettings";
import SecuritySettings from "@/components/dashboard/settings/SecuritySettings";
import NotificationSettings from "@/components/dashboard/settings/NotificationSettings";
import PreferenceSettings from "@/components/dashboard/settings/PreferenceSettings";
import ThemeSettings from "@/components/dashboard/settings/ThemeSettings";
import LanguageSettings from "@/components/dashboard/settings/LanguageSettings";
import DangerZone from "@/components/dashboard/settings/DangerZone";

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
