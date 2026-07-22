"use client";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: Props) {
  return <>{children}</>;
}