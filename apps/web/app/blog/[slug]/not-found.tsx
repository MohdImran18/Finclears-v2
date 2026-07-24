export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Blog Not Found
        </h1>

        <p className="mt-4 text-gray-600">
          The article you are looking for does not exist.
        </p>
      </div>
    </main>
  );
}