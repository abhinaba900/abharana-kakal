"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const disableSmoothScroll =
    pathname === "/retreats" ||
    pathname.startsWith("/retreats/") ||
    pathname === "/sound-healing" ||
    pathname.startsWith("/sound-healing/") ||
    pathname === "/journal" ||
    pathname.startsWith("/journal/");

  if (disableSmoothScroll) {
    return <>{children}</>;
  }

  return (
    <ReactLenis 
      root 
      options={{
        duration: 1.2,
        smoothWheel: true,
        syncTouch: true,
        syncTouchLerp: 0.08,
        touchMultiplier: 1,
        overscroll: true,
        anchors: true,
        autoRaf: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
