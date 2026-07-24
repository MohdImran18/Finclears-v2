export default function PersonalInfo() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-6 text-xl font-bold">
        Personal Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <input placeholder="Full Name" className="rounded-xl border p-4" />

        <input placeholder="Email" className="rounded-xl border p-4" />

        <input placeholder="Phone" className="rounded-xl border p-4" />

        <input placeholder="PAN Number" className="rounded-xl border p-4" />

      </div>

    </div>
  );
}
