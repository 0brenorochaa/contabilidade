import { i as isValid, n as parseISO, r as format, t as ptBR } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-ByvtKy4h.js
function formatMoney(value, currency = "BRL") {
	const safe = Number.isFinite(value) ? value : 0;
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(safe);
}
function parseMoneyInput(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const normalized = trimmed.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
	const n = Number(normalized);
	if (!Number.isFinite(n) || n <= 0) return null;
	return Math.round(n * 100) / 100;
}
function formatDateBR(iso) {
	if (!iso) return "—";
	const d = iso.length <= 10 ? parseISO(`${iso}T00:00:00`) : parseISO(iso);
	if (!isValid(d)) return iso;
	return format(d, "dd/MM/yyyy", { locale: ptBR });
}
function formatDateTimeBR(iso) {
	const d = parseISO(iso);
	if (!isValid(d)) return iso;
	return format(d, "dd/MM/yyyy HH:mm", { locale: ptBR });
}
function incomeSourceLabel(id) {
	return id ? {
		salario: "Salário",
		jovem_aprendiz: "Jovem Aprendiz",
		freelancer: "Freelancer",
		mesada: "Mesada",
		transferencia: "Transferência",
		outros: "Outros"
	}[id] ?? id : "—";
}
function accountTypeLabel(id) {
	return {
		banco: "Banco",
		dinheiro: "Dinheiro",
		carteira_digital: "Carteira digital",
		poupanca: "Poupança",
		outra: "Outra"
	}[id] ?? id;
}
//#endregion
export { incomeSourceLabel as a, formatMoney as i, formatDateBR as n, parseMoneyInput as o, formatDateTimeBR as r, accountTypeLabel as t };
