"use client";

import { Button } from "@/components/ui/Button";
import { NavLink } from "@/components/ui/NavLink";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { SocialLinks } from "@/components/social/SocialLinks";
import { useAnnouncementVisible } from "@/components/layout/AnnouncementContext";
import {
  announcementMainPadClass,
  announcementNavbarTopClass,
  mobileMenuBackdropClass,
  mobileMenuPanelClass,
  navbarHomeTopClass,
  navbarScrolledClass,
  navbarShellClass,
} from "@/lib/announcement-bar-layout";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

export function Navbar() {
  const scrolled = useScrollPosition();
  const pathname = usePathname();
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

  const announcementVisible = useAnnouncementVisible();
  const isHome = pathname === "/";
  /** Solid bar while scrolling or on inner pages — always fixed at top */
  const solidNav = scrolled || !isHome || mobileOpen;
  const lightNav = isHome && !solidNav;

  const closeMobile = () => setMobileOpen(false);

  const scrollToHash = (href: string) => {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return false;
    const basePath = href.slice(0, hashIndex) || "/";
    const id = href.slice(hashIndex + 1);
    if (pathname !== basePath) return false;
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
    return true;
  };

  const handleNavClick = (href: string) => (e: MouseEvent) => {
    if (scrollToHash(href)) {
      e.preventDefault();
    }
    closeMobile();
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
          : lightNav
            ? "text-white/90"
            : "text-navy-700 dark:text-navy-200"
    );

  return (
    <>
      <header
        className={cn(
          navbarShellClass,
          announcementVisible ? announcementNavbarTopClass : "top-0",
          solidNav ? navbarScrolledClass : navbarHomeTopClass
        )}
      >
        <nav className="container-custom flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <NavLink href="/" className="flex shrink-0 items-center gap-2" onNavigate={closeMobile}>
            <BrandLogo />
          </NavLink>

          <div className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className={linkClass(link.href)}
                onNavigate={handleNavClick(link.href)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <SocialLinks variant="navbar" className="hidden xl:flex" />
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  lightNav
                    ? "text-white hover:bg-white/10"
                    : "text-navy-700 hover:bg-navy-100 dark:text-navy-200 dark:hover:bg-navy-800"
                )}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}
            <Button href="/services" size="sm">
              Get Started
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "rounded-full p-2",
                  lightNav ? "text-white" : "text-navy-900 dark:text-white"
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
                lightNav ? "text-white" : "text-navy-900 dark:text-white"
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
              mobileMenuBackdropClass,
              announcementVisible ? announcementMainPadClass : "top-20"
            )}
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <div
            className={cn(
              mobileMenuPanelClass,
              announcementVisible ? announcementMainPadClass : "top-20"
            )}
          >
            <div className="container-custom flex max-h-[calc(100vh-5rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch
                  className={linkClass(link.href, true)}
                  onClick={handleNavClick(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 border-t border-navy-100 pt-3 dark:border-navy-800">
                <Link
                  href="/services"
                  prefetch
                  className="block w-full rounded-full bg-gold-500 px-6 py-3 text-center font-semibold text-navy-950 transition-colors hover:bg-gold-400"
                  onClick={closeMobile}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
