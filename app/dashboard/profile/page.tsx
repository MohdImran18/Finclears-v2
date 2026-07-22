import ProfileCard from "@/components/dashboard/profile/ProfileCard";
import PersonalInfo from "@/components/dashboard/profile/PersonalInfo";
import CompanyInfo from "@/components/dashboard/profile/CompanyInfo";
import AddressCard from "@/components/dashboard/profile/AddressCard";
import KYCStatus from "@/components/dashboard/profile/KYCStatus";
import ProfileCompletion from "@/components/dashboard/profile/ProfileCompletion";
import ProfileActions from "@/components/dashboard/profile/ProfileActions";

export default function ProfilePage() {
  return (
    <div className="space-y-8">

      <ProfileCard />

      <ProfileCompletion progress={75} />

      <PersonalInfo />

      <CompanyInfo />

      <AddressCard />

      <KYCStatus />

      <ProfileActions />

    </div>
  );
}
