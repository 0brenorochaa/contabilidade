import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  Flag,
  History,
  Lock,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { BrandLink } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { APP_SLOGAN } from "@/lib/constants";

export const Route = createFileRoute("/")({ component: Landing });

const FEATURES = [
  { icon: Wallet, title: "Controle de despesas", body: "Registre gastos com data, local e categoria, e veja para onde o dinheiro está indo." },
  { icon: TrendingUp, title: "Controle de receitas", body: "Acompanhe salário, freelancer e outras origens em um só lugar." },
  { icon: Flag, title: "Metas financeiras", body: "Defina objetivos, adicione valores e acompanhe o progresso com clareza." },
  { icon: PieChart, title: "Gráficos", body: "Visualize receitas, despesas, categorias e a evolução do saldo com dados reais." },
  { icon: BarChart3, title: "Orçamento", body: "Estabeleça um limite mensal e receba alertas ao se aproximar dele." },
  { icon: History, title: "Histórico", body: "Pesquise, filtre, edite e exclua movimentações com segurança." },
  { icon: ShieldCheck, title: "Segurança", body: "Senhas protegidas, sessões isoladas e dados que pertencem só a você." },
  { icon: Lock, title: "Organização financeira", body: "Painel, insights e configurações pensados para o dia a dia." },
];

function Landing() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <BrandLink />
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link to="/cadastro">Começar agora</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:py-20">
        <div className="stagger-in">
          <p className="text-sm font-medium tracking-wide text-primary">{APP_SLOGAN}</p>
          <h1 className="font-display mt-3 max-w-xl text-4xl leading-tight font-medium tracking-tight md:text-5xl">
            Finanças pessoais com clareza, sem ruído.
          </h1>
          <p className="mt-4 max-w-lg text-muted-foreground">
            Tenha uma visão clara das suas finanças, controle seus gastos, acompanhe suas metas e organize seu futuro financeiro.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/cadastro">Começar agora</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Entrar</Link>
            </Button>
          </div>
        </div>
        <HeroPreview />
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-xl border border-border bg-background p-5">
              <f.icon className="size-5 text-primary" />
              <h2 className="mt-3 font-semibold">{f.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <Lock className="mx-auto size-6 text-primary" />
        <h2 className="mt-4 font-display text-3xl">Seus dados financeiros pertencem a você</h2>
        <p className="mt-3 text-muted-foreground">
          Cada conta é isolada. Transações, metas e contas de um usuário nunca ficam visíveis para outro.
          Senhas são armazenadas com hash seguro. Exportar ou excluir seus dados é uma escolha sua.
        </p>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>FinTrack — {APP_SLOGAN}</p>
          <div className="flex gap-4">
            <Link to="/cadastro" className="hover:text-foreground">
              Criar conta
            </Link>
            <Link to="/login" className="hover:text-foreground">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Saldo disponível</p>
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Este mês</span>
      </div>
      <p className="mt-2 text-3xl font-semibold tabular">R$ 0,00</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">Receitas</p>
          <p className="text-lg font-semibold text-income tabular">R$ 0,00</p>
        </div>
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">Despesas</p>
          <p className="text-lg font-semibold tabular">R$ 0,00</p>
        </div>
      </div>
      <div className="mt-5 h-24 overflow-hidden rounded-lg bg-muted px-3 pt-6">
        <svg viewBox="0 0 320 80" className="h-full w-full text-primary" aria-hidden="true">
          <path
            d="M0 60 C40 58 50 40 80 42 C110 44 120 22 160 28 C200 34 210 18 250 20 C280 22 300 12 320 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
