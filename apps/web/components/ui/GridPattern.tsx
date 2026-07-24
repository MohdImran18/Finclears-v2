export default function GridPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "linear-gradient(#2563eb 1px, transparent 1px),linear-gradient(90deg,#2563eb 1px,transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  );
}
