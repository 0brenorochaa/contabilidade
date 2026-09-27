import { r as toIsoDate } from "./utils-WuDAn4c5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-C4yQuJT7.js
function startOfMonth(d) {
	return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d) {
	return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
function addDays(d, days) {
	const n = new Date(d);
	n.setDate(n.getDate() + days);
	return n;
}
function resolvePeriod(id, custom, now = /* @__PURE__ */ new Date()) {
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	if (id === "this_month") return {
		from: toIsoDate(startOfMonth(today)),
		to: toIsoDate(endOfMonth(today))
	};
	if (id === "last_month") {
		const prev = new Date(today.getFullYear(), today.getMonth() - 1, 1);
		return {
			from: toIsoDate(startOfMonth(prev)),
			to: toIsoDate(endOfMonth(prev))
		};
	}
	if (id === "last_7") return {
		from: toIsoDate(addDays(today, -6)),
		to: toIsoDate(today)
	};
	if (id === "last_30") return {
		from: toIsoDate(addDays(today, -29)),
		to: toIsoDate(today)
	};
	if (id === "last_90") return {
		from: toIsoDate(addDays(today, -89)),
		to: toIsoDate(today)
	};
	const from = custom?.from && /^\d{4}-\d{2}-\d{2}$/.test(custom.from) ? custom.from : toIsoDate(addDays(today, -29));
	const to = custom?.to && /^\d{4}-\d{2}-\d{2}$/.test(custom.to) ? custom.to : toIsoDate(today);
	return from <= to ? {
		from,
		to
	} : {
		from: to,
		to: from
	};
}
function previousRange(range) {
	const from = /* @__PURE__ */ new Date(`${range.from}T00:00:00`);
	const to = /* @__PURE__ */ new Date(`${range.to}T00:00:00`);
	const days = Math.round((to.getTime() - from.getTime()) / 864e5) + 1;
	const prevTo = addDays(from, -1);
	const prevFrom = addDays(prevTo, -(days - 1));
	return {
		from: toIsoDate(prevFrom),
		to: toIsoDate(prevTo)
	};
}
function monthsUntil(deadlineIso, now = /* @__PURE__ */ new Date()) {
	const deadline = /* @__PURE__ */ new Date(`${deadlineIso}T00:00:00`);
	if (Number.isNaN(deadline.getTime()) || deadline <= now) return 0;
	const months = (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth());
	const adjust = deadline.getDate() < now.getDate() ? -1 : 0;
	return Math.max(0, months + adjust);
}
function netBalance(income, expense) {
	return roundMoney(income - expense);
}
function roundMoney(value) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}
function clampProgress(current, target) {
	if (target <= 0) return 0;
	return Math.min(100, Math.max(0, current / target * 100));
}
function suggestedMonthlySaving(remaining, months) {
	if (months <= 0 || remaining <= 0) return null;
	return roundMoney(remaining / months);
}
//#endregion
export { resolvePeriod as a, previousRange as i, monthsUntil as n, suggestedMonthlySaving as o, netBalance as r, clampProgress as t };
