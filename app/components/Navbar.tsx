import Link from "next/link";
import BookSessionButton from "./BookSessionButton";
import AudioButton from "./AudioButton";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-4 md:px-6 py-2 md:py-4">
      <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
        <img
          src="/Asset 2Abharana Kakal - monogram only.svg"
          alt="Abharana Kakal Logo"
          className="h-16 md:h-32 w-auto object-contain "
        />
      </Link>

      {/* Desktop Navigation Menu */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10 items-center uppercase tracking-[0.1em] text-[13px] font-medium pointer-events-auto">
        {[
          { name: "About", href: "/about" },
          { name: "Sound Healing", href: "/sound-healing" },
          { name: "Retreats", href: "/retreats" },
          { name: "Journal", href: "/journal" },
          { name: "Contact", href: "/contact" },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group relative flex items-center justify-center px-5 h-[36px] md:h-[46px] bg-[#bc6746] text-[#FFFDF8] rounded-full
                       shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-white/10
                       transition-transform duration-250 ease-in-out
                       hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(188,103,70,0.4)]
                       active:saturate-75 active:translate-y-0
                       overflow-hidden z-[100]"
          >
            <div className="absolute inset-0 bg-[#a55a3d] -z-10 -translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-0" />
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="flex gap-3 md:gap-4 items-center text-sm text-gray-300 pointer-events-auto">
        <AudioButton />
        <BookSessionButton />
        <Link 
          href="https://www.instagram.com/abharana_kakal/"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-[36px] h-[36px] md:w-[46px] md:h-[46px] bg-[#bc6746] text-[#FFFDF8] rounded-full
                     shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-white/10
                     transition-transform duration-250 ease-in-out
                     hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(188,103,70,0.4)]
                     active:saturate-75 active:translate-y-0
                     overflow-hidden z-[100]"
        >
          {/* Sliding hover background like BookSessionButton */}
          <div className="absolute inset-0 bg-[#a55a3d] -z-10 -translate-x-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-0" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] transition-colors duration-300"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
