import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Flag,
  History,
  LayoutDashboard,
  LogOut,
  PieChart,
  Plus,
  Settings,
  Shield,
  UserRound,
  Wallet,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { BrandLink } from "@/components/brand";
import { TransactionSheet } from "@/components/transaction-form";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useTheme } from "@/components/theme-provider";
import { getMe, listNotifications } from "@/lib/server/user";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app", label: "Início", icon: LayoutDashboard },
  { to: "/app/historico", label: "Histórico", icon: History },
  { to: "/app/metas", label: "Metas", icon: Flag },
  { to: "/app/graficos", label: "Gráficos", icon: PieChart },
  { to: "/app/orcamento", label: "Orçamento", icon: Wallet },
  { to: "/app/perfil", label: "Perfil", icon: UserRound },
];

const MOBILE = [
  { to: "/app", label: "Início", icon: LayoutDashboard },
  { to: "/app/historico", label: "Histórico", icon: History },
  { to: "__add", label: "Adicionar", icon: Plus },
  { to: "/app/metas", label: "Metas", icon: Flag },
  { to: "/app/perfil", label: "Perfil", icon: UserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const openAdd = useAppStore((s) => s.openAdd);
  const { setTheme } = useTheme();

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    enabled: Boolean(user),
  });
  const notes = useQuery({
    queryKey: ["notifications"],
    queryFn: () => listNotifications(),
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (me.data?.theme) setTheme(me.data.theme);
  }, [me.data?.theme, setTheme]);

  if (isPending || (user && me.isPending)) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background text-muted-foreground">
        Carregando…
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (me.error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
        <p>Não foi possível carregar sua sessão.</p>
        <Button onClick={() => void signOut("/")}>Sair</Button>
      </div>
    );
  }
  if (me.data && !me.data.isActive) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
        <p>Esta conta foi desativada.</p>
        <Button onClick={() => void signOut("/")}>Sair</Button>
      </div>
    );
  }
  if (me.data?.mustChangePassword) {
    return <Navigate to="/admin/senha" />;
  }
  if (me.data && !me.data.onboardingCompleted) {
    return <Navigate to="/onboarding" />;
  }

  const unread = (notes.data ?? []).filter((n) => !n.read_at).length;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-sidebar p-4 lg:flex lg:flex-col">
        <BrandLink />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/app/configuracoes"
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              pathname.startsWith("/app/configuracoes")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings className="size-4" />
            Configurações
          </Link>
          {me.data?.role === "admin" ? (
            <Link
              to="/admin"
              className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Shield className="size-4" />
              Administração
            </Link>
          ) : null}
        </nav>
        <button
          type="button"
          onClick={() => void signOut("/")}
          className="flex h-11 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="lg:hidden">
            <BrandLink compact />
          </div>
          <p className="hidden text-sm text-muted-foreground lg:block">
            Olá, {me.data?.name?.split(" ")[0] ?? user.displayName ?? "por aqui"}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/app/notificacoes"
              className="relative grid size-11 place-items-center rounded-md hover:bg-muted"
              aria-label="Notificações"
            >
              <Bell className="size-5" />
              {unread > 0 ? (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
              ) : null}
            </Link>
            <Button className="hidden md:inline-flex" onClick={() => openAdd()}>
              <Plus className="size-4" />
              Adicionar
            </Button>
          </div>
        </header>
        <main className="px-4 py-5 pb-28 md:px-6 lg:pb-8">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
        aria-label="Navegação principal"
      >
        <ul className="grid grid-cols-5">
          {MOBILE.map((item) => {
            const Icon = item.icon;
            if (item.to === "__add") {
              return (
                <li key="add">
                  <button
                    type="button"
                    onClick={() => openAdd()}
                    className="-mt-5 mx-auto flex size-14 flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft"
                    aria-label="Adicionar"
                  >
                    <Plus className="size-6" />
                  </button>
                </li>
              );
            }
            const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 text-[11px]",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <TransactionSheet />
    </div>
  );
}
