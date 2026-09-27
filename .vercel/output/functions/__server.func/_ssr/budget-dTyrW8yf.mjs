//#region node_modules/.nitro/vite/services/ssr/assets/budget-dTyrW8yf.js
function budgetUsage(spent, limit) {
	if (limit <= 0) return 0;
	return spent / limit * 100;
}
function budgetAlertLevel(spent, limit) {
	if (limit <= 0) return "none";
	if (spent > limit) return "over";
	if (spent >= limit) return "limit";
	if (spent >= limit * .8) return "warn";
	return "none";
}
function budgetRemaining(spent, limit) {
	return Math.round((limit - spent) * 100) / 100;
}
function budgetAlertMessage(level, spent, limit) {
	if (level === "warn") return "Você atingiu 80% do orçamento mensal.";
	if (level === "limit") return "Você atingiu 100% do orçamento mensal.";
	if (level === "over") return "Você ultrapassou o limite do orçamento mensal.";
	return null;
}
//#endregion
export { budgetUsage as i, budgetAlertMessage as n, budgetRemaining as r, budgetAlertLevel as t };
