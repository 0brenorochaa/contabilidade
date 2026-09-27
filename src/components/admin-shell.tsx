import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ScrollText, Shield, Users } from "lucide-react";
import type { ReactNode } from "react";
import { BrandLink } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMe } from "@/lib/server/user";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Painel", icon: LayoutDashboard },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
  { to: "/admin/auditoria", label: "Auditoria", icon: ScrollText },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const me = useQuery({ queryKey: ["me"], queryFn: () => getMe(), enabled: Boolean(user) });
  const passwordGate = pathname === "/admin/senha";

  if (isPending || (user && me.isPending)) {
    return <div className="grid min-h-dvh place-items-center">Carregando…</div>;
  }
  if (!user) return <RedirectToSignIn />;
  if (me.data && me.data.role !== "admin") {
    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center">
        <div>
          <p>Acesso administrativo não autorizado.</p>
          <Button asChild className="mt-4">
            <Link to="/app">Voltar</Link>
          </Button>
        </div>
      </div>
    );
  }
  if (me.data?.mustChangePassword && !passwordGate) {
    return <Navigate to="/admin/senha" />;
  }

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-56 border-r border-border bg-sidebar p-4 md:flex md:flex-col">
        <BrandLink compact />
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="size-3" /> Área administrativa
        </p>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link to="/app" className="mb-2 text-sm text-muted-foreground hover:text-foreground">
          Ir ao app
        </Link>
        <button type="button" className="text-left text-sm text-muted-foreground" onClick={() => void signOut("/")}>
          Sair
        </button>
      </aside>
      <div className="md:pl-56">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <BrandLink compact />
          <Link to="/app" className="text-sm">
            App
          </Link>
        </header>
        <main className="px-4 py-5 md:px-6">{children}</main>
      </div>
    </div>
  );
}
