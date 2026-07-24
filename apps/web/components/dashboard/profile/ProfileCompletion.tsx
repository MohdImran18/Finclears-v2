interface Props {
  progress: number;
}

export default function ProfileCompletion({
  progress,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow">

      <h2 className="font-bold">
        Profile Completion
      </h2>

      <div className="mt-5 h-4 rounded-full bg-slate-200">

        <div
          className="h-4 rounded-full bg-blue-600"
          style={{ width: `${progress}%` }}
        />

      </div>

      <p className="mt-3">
        {progress}% Completed
      </p>

    </div>
  );
}
