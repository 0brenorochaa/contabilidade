import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as cn } from "./utils-WuDAn4c5.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { i as formatMoney, o as parseMoneyInput } from "./format-ByvtKy4h.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { t as Switch } from "./switch-0H6xosTq.mjs";
import { t as Progress } from "./progress-DQ0BwzAX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orcamento-Dx65YIWt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getBudget = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2e25cec93829d5dbb25598311f8499221c175da7d4d945d1633d5619885983dc"));
var saveBudget = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("160a70a05b1b42e4524a159cfa2c5608e4f2f83e2b13c5d662780ca2b06d8c36"));
function Orcamento() {
	const qc = useQueryClient();
	const budget = useQuery({
		queryKey: ["budget"],
		queryFn: () => getBudget()
	});
	const [limit, setLimit] = (0, import_react.useState)("");
	const [enabled, setEnabled] = (0, import_react.useState)(true);
	const save = useMutation({
		mutationFn: async () => {
			const parsed = parseMoneyInput(limit) ?? (budget.data && budget.data.configured ? budget.data.limit : null);
			if (!parsed) throw new Error("Informe um limite mensal.");
			await saveBudget({ data: {
				monthlyLimit: parsed,
				enabled
			} });
		},
		onSuccess: async () => {
			toast.success("Orçamento salvo.");
			await qc.invalidateQueries({ queryKey: ["budget"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const data = budget.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Orçamento"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Defina um limite mensal de gastos e acompanhe o restante."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-4",
					onSubmit: (e) => {
						e.preventDefault();
						save.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "limit",
							children: "Limite mensal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "limit",
							className: "mt-1.5 max-w-xs",
							placeholder: data && data.configured ? String(data.limit).replace(".", ",") : "1000,00",
							value: limit,
							onChange: (e) => setLimit(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: enabled,
								onCheckedChange: setEnabled
							}), "Ativar alertas de orçamento"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-fit",
							disabled: save.isPending,
							children: "Salvar"
						})
					]
				})
			}),
			data && data.configured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Este mês"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Orçamento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular font-medium",
									children: formatMoney(data.limit)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Gasto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "tabular font-medium",
									children: formatMoney(data.spent)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Restante" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: cn("tabular font-medium", data.remaining < 0 && "text-expense"),
									children: formatMoney(data.remaining)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: Math.min(100, data.usage),
						className: "mt-4",
						indicatorClassName: data.alert === "over" || data.alert === "limit" ? "bg-expense" : void 0
					}),
					data.alert === "warn" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm",
						children: "Você atingiu 80% do orçamento mensal."
					}) : null,
					data.alert === "limit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm",
						children: "Você atingiu 100% do orçamento mensal."
					}) : null,
					data.alert === "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-expense",
						children: "Você ultrapassou o limite do orçamento mensal."
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "O orçamento ainda não foi configurado."
			})
		]
	});
}
//#endregion
export { Orcamento as component };
