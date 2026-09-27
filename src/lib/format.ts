import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatMoney(value: number, currency = "BRL"): string {
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

export function parseMoneyInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.round(n * 100) / 100;
}

export function formatDateBR(iso: string): string {
  if (!iso) return "—";
  const d = iso.length <= 10 ? parseISO(`${iso}T00:00:00`) : parseISO(iso);
  if (!isValid(d)) return iso;
  return format(d, "dd/MM/yyyy", { locale: ptBR });
}

export function formatDateTimeBR(iso: string): string {
  const d = parseISO(iso);
  if (!isValid(d)) return iso;
  return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function incomeSourceLabel(id: string | null | undefined): string {
  const map: Record<string, string> = {
    salario: "Salário",
    jovem_aprendiz: "Jovem Aprendiz",
    freelancer: "Freelancer",
    mesada: "Mesada",
    transferencia: "Transferência",
    outros: "Outros",
  };
  return id ? (map[id] ?? id) : "—";
}

export function accountTypeLabel(id: string): string {
  const map: Record<string, string> = {
    banco: "Banco",
    dinheiro: "Dinheiro",
    carteira_digital: "Carteira digital",
    poupanca: "Poupança",
    outra: "Outra",
  };
  return map[id] ?? id;
}

export function financialGoalLabel(id: string | null | undefined): string {
  const map: Record<string, string> = {
    economizar: "Economizar dinheiro",
    controlar_gastos: "Controlar meus gastos",
    comprar: "Comprar alguma coisa",
    reserva: "Criar uma reserva de emergência",
    investir: "Investir",
    organizar: "Organizar minha vida financeira",
    outro: "Outro",
  };
  return id ? (map[id] ?? id) : "Não informado";
}
