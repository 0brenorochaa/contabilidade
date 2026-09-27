import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { a as XAxis, c as Pie, d as Tooltip, f as Legend, i as YAxis, l as Cell, n as BarChart, o as Line, r as LineChart, s as Bar, t as PieChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { i as formatMoney } from "./format-ByvtKy4h.mjs";
import { o as getDashboard } from "./finance-B8dL9te4.mjs";
import { t as useAppStore } from "./store-CEa72zWv.mjs";
import { t as EmptyState } from "./empty-state-DqIfo5Ga.mjs";
import { t as PeriodFilter } from "./period-filter-CoZfxcST.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/graficos-CuF3AJqC.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#0D7A5F",
	"#1E5A8A",
	"#3D8B74",
	"#6EA3CC",
	"#8AA39A",
	"#C24141",
	"#2A6F97",
	"#5C6D66"
];
function Graficos() {
	const period = useAppStore((s) => s.period);
	const from = useAppStore((s) => s.customFrom);
	const to = useAppStore((s) => s.customTo);
	const openAdd = useAppStore((s) => s.openAdd);
	const dash = useQuery({
		queryKey: [
			"dashboard",
			period,
			from,
			to
		],
		queryFn: () => getDashboard({ data: {
			period,
			from,
			to
		} })
	});
	if (dash.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Carregando gráficos…"
	});
	if (!dash.data?.hasAnyData) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Sem dados suficientes para gráficos",
		description: "Registre movimentações para visualizar comparativos reais.",
		action: {
			label: "Adicionar movimentação",
			onClick: () => openAdd()
		}
	});
	const d = dash.data;
	const compare = [{
		name: "Receitas",
		valor: d.periodIncome
	}, {
		name: "Despesas",
		valor: d.periodExpense
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Gráficos"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Atualizados automaticamente com as suas movimentações."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-semibold",
						children: "Receitas × despesas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: compare,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => formatMoney(v) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "valor",
										radius: [
											8,
											8,
											0,
											0
										],
										children: compare.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.name === "Receitas" ? "#0D7A5F" : "#C24141" }, entry.name))
									})
								]
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-semibold",
						children: "Evolução do saldo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: d.evolution.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Sem pontos neste período."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: d.evolution,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => formatMoney(v) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "balance",
										stroke: "#0D7A5F",
										strokeWidth: 2,
										dot: false
									})
								]
							})
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-semibold",
						children: "Gastos por categoria"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: d.categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Nenhuma despesa categorizada neste período."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: d.categories,
									dataKey: "total",
									nameKey: "name",
									innerRadius: 50,
									outerRadius: 80,
									children: d.categories.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, c.name))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => formatMoney(v) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
							] })
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 font-semibold",
						children: "Receitas por período"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: d.evolution,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => formatMoney(v) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "income",
										stroke: "#1E5A8A",
										strokeWidth: 2,
										dot: false
									})
								]
							})
						})
					})]
				})
			]
		})]
	});
}
//#endregion
export { Graficos as component };
