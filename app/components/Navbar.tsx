import Link from "next/link";
import BookSessionButton from "./BookSessionButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
        <img
          src="/Asset 2Abharana Kakal - monogram only.svg"
          alt="Abharana Kakal Logo"
          className="h-28 md:h-32 w-auto object-contain "
        />
      </Link>
      <div className="flex gap-6 items-center text-sm text-gray-300 pointer-events-auto">
        <BookSessionButton />
      </div>
    </nav>
  );
}
