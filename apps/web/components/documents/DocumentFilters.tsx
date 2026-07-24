"use client";

interface DocumentFiltersProps {
  search: string;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function DocumentFilters({
  search,
  onSearch,
}: DocumentFiltersProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search documents..."
        className="w-full rounded-lg border px-4 py-2"
      />
    </div>
  );
}
