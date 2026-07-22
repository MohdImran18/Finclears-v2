export default function Noise() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
      style={{
        backgroundImage:
          "url('https://grainy-gradients.vercel.app/noise.svg')",
      }}
    />
  );
}
