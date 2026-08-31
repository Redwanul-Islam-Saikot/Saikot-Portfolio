"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "About me", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Education", href: "/education" },
  { name: "Contact me", href: "/contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-[#111111] px-6 lg:px-12 py-5 border-b border-neutral-800">
      <div className="w-full flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="text-2xl font-bold tracking-wider text-[#FF6400]">
          Md. Redwanul Islam Saikot
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-12 lg:gap-16 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setActive(link.name)}
                className={`text-lg font-medium transition-colors hover:text-[#FF6400] ${
                  active === link.name ? "text-[#FF6400]" : "text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Button - Desktop */}
        <div className="hidden md:block">
          <Link
            href="/contact"
            className="rounded-xl bg-[#FF6400] px-7 py-3 text-lg font-semibold text-white transition hover:bg-[#e05800]"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 focus:outline-none md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="mt-4 flex flex-col gap-4 rounded-lg bg-[#181818] p-5 md:hidden border border-neutral-800">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => {
                setActive(link.name);
                setIsOpen(false);
              }}
              className={`text-lg font-medium transition-colors ${
                active === link.name ? "text-[#FF6400]" : "text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="w-full text-center rounded-xl bg-[#FF6400] py-3 text-lg font-semibold text-white transition hover:bg-[#e05800]"
          >
            Hire Me
          </Link>
        </div>
      )}
    </nav>
  );
}