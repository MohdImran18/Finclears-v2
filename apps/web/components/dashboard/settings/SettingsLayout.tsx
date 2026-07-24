interface Props {
  children: React.ReactNode;
}

export default function SettingsLayout({
  children,
}: Props) {
  return (
    <div className="space-y-8">
      {children}
    </div>
  );
}
