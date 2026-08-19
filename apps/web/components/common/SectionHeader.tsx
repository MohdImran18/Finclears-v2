import SectionSubtitle from "./SectionSubtitle";
import SectionTitle from "./SectionTitle";

interface Props {
	title: string;
	subtitle: string;
}

export default function SectionHeader({ title, subtitle }: Props) {
	return (
		<div className="text-center mb-16">
			<SectionTitle>{title}</SectionTitle>
			<SectionSubtitle>{subtitle}</SectionSubtitle>
		</div>
	);
}

