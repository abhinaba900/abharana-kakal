'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import SmoothScroll from './SmoothScroll';

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <SmoothScroll>{children}</SmoothScroll>
    </>
  );
}
