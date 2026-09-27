import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { a as logAdminAuthEvent, t as getAdminDashboard } from "./admin-DULpBvHo.mjs";
import { a as XAxis, d as Tooltip, i as YAxis, n as BarChart, s as Bar, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DWQf9BWr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminHome() {
	const dash = useQuery({
		queryKey: ["admin-dashboard"],
		queryFn: () => getAdminDashboard()
	});
	(0, import_react.useEffect)(() => {
		logAdminAuthEvent({ data: {
			action: "admin.login",
			result: "success"
		} }).catch(() => {});
	}, []);
	if (dash.isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-expense",
		children: "Acesso administrativo não autorizado."
	});
	if (!dash.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Carregando métricas…"
	});
	const d = dash.data;
	const cards = [
		["Usuários", d.users],
		["Ativos", d.active],
		["Novos no mês", d.newcomers],
		["Transações", d.transactions],
		["Metas", d.goals],
		["Contas", d.accounts],
		["Erros (7 dias)", d.errors]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Painel administrativo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Métricas agregadas. Sem detalhes financeiros privados dos usuários."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: cards.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl font-semibold tabular",
						children: value
					})]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-semibold",
					children: "Crescimento de usuários (30 dias)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: d.growth,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									hide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { allowDecimals: false }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "total",
									fill: "#0D7A5F",
									radius: [
										8,
										8,
										0,
										0
									]
								})
							]
						})
					})
				})]
			})
		]
	});
}
//#endregion
export { AdminHome as component };
