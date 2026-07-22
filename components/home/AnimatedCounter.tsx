"use client";

import CountUp from "react-countup";

interface Props {
  end: number;
  suffix?: string;
}

export default function AnimatedCounter({
  end,
  suffix = "",
}: Props) {
  return (
    <CountUp
      end={end}
      duration={3}
      enableScrollSpy
      suffix={suffix}
    />
  );
}
