export default function CompanyInfo() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-xl font-bold">
        Company Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <input placeholder="Company Name" className="rounded-xl border p-4" />

        <input placeholder="GST Number" className="rounded-xl border p-4" />

        <input placeholder="IEC Code" className="rounded-xl border p-4" />

        <input placeholder="CIN / LLPIN" className="rounded-xl border p-4" />

      </div>

    </div>
  );
}
