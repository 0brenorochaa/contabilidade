import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="currentColor" className="text-primary" />
      <path
        d="M9 20.5c3.2-1.4 5.1-5.8 7.2-5.8 1.5 0 2.3 1.6 3.5 1.6 1.6 0 2.4-2.3 3.3-3.8"
        fill="none"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="22.8" cy="12.2" r="1.4" fill="white" />
    </svg>
  );
}

export function BrandLink({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 text-foreground">
      <LogoMark />
      <span className={cn("font-semibold tracking-tight", compact ? "text-base" : "text-lg")}>
        FinTrack
      </span>
    </Link>
  );
}
