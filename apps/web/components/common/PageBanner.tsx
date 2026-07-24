interface Props {
  title: string;
}

export default function PageBanner({
  title,
}: Props) {
  return (
    <section className="bg-slate-900 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-5xl font-bold">
          {title}
        </h1>
      </div>
    </section>
  );
}
