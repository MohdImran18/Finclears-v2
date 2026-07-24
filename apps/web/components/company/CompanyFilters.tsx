"use client";

interface Props {
  search: string;
  onSearch: (value: string) => void;
}

export default function CompanyFilters({
  search,
  onSearch,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <input
        value={search}
        onChange={(e) =>
          onSearch(e.target.value)
        }
        placeholder="Search company..."
        className="w-full rounded-lg border p-3"
      />

    </div>
  );
}
