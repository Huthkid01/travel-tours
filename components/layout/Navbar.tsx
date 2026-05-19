"use client";

import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/ui/NavLink";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { IS_DEMO_MODE, NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu, Moon, Plane, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const scrolled = useScrollPosition();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  const goTo = (href: string) => {
    closeMobile();
    router.push(href);
  };

  const linkClass = (href: string, mobile = false) =>
    cn(
      mobile
        ? "block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors"
        : "text-sm font-medium transition-colors hover:text-gold-500",
      pathname === href
        ? mobile
          ? "bg-gold-500/10 text-gold-600"
          : "text-gold-500"
        : mobile
          ? "text-navy-700 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-900"
          : scrolled
            ? "text-navy-700 dark:text-navy-200"
            : "text-white/90"
    );

  return (
    <>
      {IS_DEMO_MODE && (
        <div className="fixed top-0 right-0 left-0 z-[210] bg-gold-500 py-1.5 text-center text-xs font-medium text-navy-950">
          Demo mode — no env setup required · forms &amp; payments are simulated
        </div>
      )}
      <header
        className={cn(
          "pointer-events-auto fixed right-0 left-0 z-[200]",
          IS_DEMO_MODE ? "top-9" : "top-0",
          scrolled
            ? "bg-white/95 shadow-lg backdrop-blur-xl dark:bg-navy-950/95"
            : "bg-gradient-to-b from-navy-950/80 to-transparent"
        )}
      >
        <nav className="container-custom flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink href="/" className="flex shrink-0 items-center gap-2" onNavigate={closeMobile}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500">
              <Plane className="h-5 w-5 text-navy-950" />
            </span>
            <span
              className={cn(
                "font-display text-xl font-bold",
                scrolled ? "text-navy-900 dark:text-white" : "text-white"
              )}
            >
              {SITE_CONFIG.name.split(" ")[0]}
              <span className="text-gold-500"> Elite</span>
            </span>
          </NavLink>

          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  scrolled
                    ? "text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800"
                    : "text-white hover:bg-white/10"
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <Button href="/reservation" size="sm">
              Book Now
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "rounded-full p-2",
                  scrolled ? "text-navy-900 dark:text-white" : "text-white"
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className={cn(
                "rounded-lg p-2",
                scrolled ? "text-navy-900 dark:text-white" : "text-white"
              )}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <>
          <button
            type="button"
            className={cn(
              "fixed right-0 bottom-0 left-0 z-[150] bg-navy-950/50 lg:hidden",
              IS_DEMO_MODE ? "top-[5.75rem]" : "top-20"
            )}
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <div
            className={cn(
              "fixed right-0 left-0 z-[160] border-b border-navy-100 bg-white shadow-2xl dark:border-navy-800 dark:bg-navy-950 lg:hidden",
              IS_DEMO_MODE ? "top-[5.75rem]" : "top-20"
            )}
          >
            <div className="container-custom flex max-h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  className={linkClass(link.href, true)}
                  onClick={() => goTo(link.href)}
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-3 border-t border-navy-100 pt-3 dark:border-navy-800">
                <button
                  type="button"
                  className="w-full rounded-full bg-gold-500 px-6 py-3 font-semibold text-navy-950 transition-colors hover:bg-gold-400"
                  onClick={() => goTo("/reservation")}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
