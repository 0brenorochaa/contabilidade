import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-WuDAn4c5.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function newId() {
	return crypto.randomUUID();
}
function toNumber(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim()) {
		const n = Number(value);
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function toIsoDate(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function todayIso() {
	return toIsoDate(/* @__PURE__ */ new Date());
}
//#endregion
export { todayIso as a, toNumber as i, newId as n, toIsoDate as r, cn as t };
