import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardPage() {
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-slate-900">
					Welcome to Finclears
				</h1>

				<p className="mt-2 text-slate-600">
					Manage your company registrations, tax filings, payments and documents
					from one place.
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
				{["Companies", "ITR Returns", "Payments", "Documents"].map((item) => (
					<Card key={item}>
						<CardHeader>
							<h3 className="font-semibold">{item}</h3>
						</CardHeader>

						<CardContent>
							<p className="text-4xl font-bold">0</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
