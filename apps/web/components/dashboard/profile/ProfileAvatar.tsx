interface Props {
  name: string;
}

export default function ProfileAvatar({
  name,
}: Props) {
  return (
    <div className="flex items-center gap-6">

      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-4xl font-bold text-white">
        {name.charAt(0)}
      </div>

      <div>

        <h2 className="text-3xl font-bold">
          {name}
        </h2>

        <p className="text-slate-500">
          Customer
        </p>

      </div>

    </div>
  );
}
