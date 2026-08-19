import AddressCard from "@/components/dashboard/profile/AddressCard";
import CompanyInfo from "@/components/dashboard/profile/CompanyInfo";
import KYCStatus from "@/components/dashboard/profile/KYCStatus";
import PersonalInfo from "@/components/dashboard/profile/PersonalInfo";
import ProfileActions from "@/components/dashboard/profile/ProfileActions";
import ProfileCard from "@/components/dashboard/profile/ProfileCard";
import ProfileCompletion from "@/components/dashboard/profile/ProfileCompletion";

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

