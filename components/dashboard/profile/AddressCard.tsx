export default function AddressCard() {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="mb-5 text-xl font-bold">
        Address
      </h2>

      <textarea
        rows={4}
        className="w-full rounded-xl border p-4"
        placeholder="Business Address"
      />

    </div>
  );
}
