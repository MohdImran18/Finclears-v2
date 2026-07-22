import BusinessForm from "./forms/BusinessForm";

interface Props {
  next: () => void;
}

export default function BusinessDetailsStep({
  next,
}: Props) {
  return (
    <>
      <h2 className="mb-6 text-2xl font-bold">
        Business Details
      </h2>

      <BusinessForm onNext={next} />
    </>
  );
}
