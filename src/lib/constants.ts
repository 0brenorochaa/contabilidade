export const APP_NAME = "FinTrack";
export const APP_SLOGAN = "Seu dinheiro. Seu controle. Seu futuro.";

export const DEFAULT_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Casa",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Assinaturas",
  "Outros",
] as const;

export const INCOME_SOURCES = [
  { id: "salario", label: "Salário" },
  { id: "jovem_aprendiz", label: "Jovem Aprendiz" },
  { id: "freelancer", label: "Freelancer" },
  { id: "mesada", label: "Mesada" },
  { id: "transferencia", label: "Transferência" },
  { id: "outros", label: "Outros" },
] as const;

export const ACCOUNT_TYPES = [
  { id: "banco", label: "Banco" },
  { id: "dinheiro", label: "Dinheiro" },
  { id: "carteira_digital", label: "Carteira digital" },
  { id: "poupanca", label: "Poupança" },
  { id: "outra", label: "Outra" },
] as const;

export const FINANCIAL_GOALS = [
  { id: "economizar", label: "Economizar dinheiro" },
  { id: "controlar_gastos", label: "Controlar meus gastos" },
  { id: "comprar", label: "Comprar alguma coisa" },
  { id: "reserva", label: "Criar uma reserva de emergência" },
  { id: "investir", label: "Investir" },
  { id: "organizar", label: "Organizar minha vida financeira" },
  { id: "outro", label: "Outro" },
] as const;

export const PERIODS = [
  { id: "this_month", label: "Este mês" },
  { id: "last_month", label: "Mês anterior" },
  { id: "last_7", label: "Últimos 7 dias" },
  { id: "last_30", label: "Últimos 30 dias" },
  { id: "last_90", label: "Últimos 3 meses" },
  { id: "custom", label: "Período personalizado" },
] as const;

export type PeriodId = (typeof PERIODS)[number]["id"];
export type IncomeSourceId = (typeof INCOME_SOURCES)[number]["id"];
export type AccountTypeId = (typeof ACCOUNT_TYPES)[number]["id"];
export type FinancialGoalId = (typeof FINANCIAL_GOALS)[number]["id"];
