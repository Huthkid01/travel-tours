"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/** Client nav link — uses Next.js prefetch for fast route changes */
export function NavLink({ href, className, children, onNavigate }: NavLinkProps) {
  return (
    <Link href={href} prefetch className={cn("relative z-10", className)} onClick={onNavigate}>
      {children}
    </Link>
  );
}
