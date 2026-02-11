"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, Menu, X, Star, Github } from "lucide-react";
import { LiveRefresh } from "@/components/live-refresh";
import { SearchDialog } from "@/components/search-dialog";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/constituencies", label: "Constituencies" },
  { href: "/parties", label: "Parties" },
  { href: "/alliances", label: "Alliances" },
  { href: "/gonovote", label: "Gonovote" },
  { href: "/search", label: "Search" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl">
      <div className="h-0.5 bg-gradient-to-r from-[#006A4E] via-[#D4A017] to-[#F42A41]" />
      <div className="border-b border-border/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#006A4E] text-white">
              <Vote className="h-4 w-4" />
            </div>
            <span className="hidden font-semibold tracking-tight sm:inline-block">
              Election Results
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <a
              href="https://github.com/dreygur/election-result"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 bg-background px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              <Star className="h-3 w-3" />
              Star
            </a>
            <SearchDialog />
            <LiveRefresh />
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="border-t border-border/40 px-4 py-2 md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
