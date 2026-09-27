import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-WuDAn4c5.mjs";
import { E as ArrowDownRight, T as ArrowUpRight, n as Wallet, p as PiggyBank } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { a as incomeSourceLabel, i as formatMoney, n as formatDateBR } from "./format-ByvtKy4h.mjs";
import { o as getDashboard } from "./finance-B8dL9te4.mjs";
import { t as useAppStore } from "./store-CEa72zWv.mjs";
import { t as EmptyState } from "./empty-state-DqIfo5Ga.mjs";
import { t as PeriodFilter } from "./period-filter-CoZfxcST.mjs";
import { t as Badge } from "./badge-CovJ2NWu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-CcVYS9zK.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, hint, tone = "neutral", icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: label
				}), icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: icon
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-2 text-2xl font-semibold tabular tracking-tight", tone === "income" && "text-income", tone === "expense" && "text-expense"),
				children: formatMoney(value)
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
function Dashboard() {
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
	if (dash.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-56" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }, i))
		})]
	});
	if (dash.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-expense",
		children: "Não foi possível carregar o painel."
	});
	const d = dash.data;
	if (!d.hasAnyData) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold",
			children: "Início"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Você ainda não possui movimentações."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Comece pelo primeiro registro",
			description: "O saldo inicia em R$ 0,00. Adicione uma receita ou despesa para ver o painel, os gráficos e o histórico.",
			action: {
				label: "Adicionar primeira movimentação",
				onClick: () => openAdd()
			},
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-8" })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "Início"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Visão do período selecionado, com saldo acumulado à parte."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Saldo disponível",
						value: d.totalBalance,
						hint: "Receitas − despesas (total)",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Receitas",
						value: d.periodIncome,
						tone: "income",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Despesas",
						value: d.periodExpense,
						tone: "expense",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Economia",
						value: d.periodNet,
						hint: "Resultado do período",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "size-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Últimas movimentações"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/historico",
								children: "Ver histórico"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: d.recent.map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between gap-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: tx.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									tx.place || (tx.incomeSource ? incomeSourceLabel(tx.incomeSource) : "—"),
									" · ",
									formatDateBR(tx.occurredOn),
									tx.categoryName ? ` · ${tx.categoryName}` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: tx.type === "income" ? "font-semibold text-income tabular" : "font-semibold text-expense tabular",
								children: [
									tx.type === "income" ? "+" : "−",
									" ",
									formatMoney(tx.amount)
								]
							})]
						}, tx.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-semibold",
							children: "Insights"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-3",
							children: d.insights.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: i.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: i.body
							})] }, i.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "mt-4 w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/insights",
								children: "Ver todos"
							})
						})
					]
				})]
			}),
			d.categories[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Gastos por categoria"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: d.categories.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						children: [
							c.name,
							": ",
							formatMoney(c.total)
						]
					}, c.name))
				})]
			}) : null
		]
	});
}
//#endregion
export { Dashboard as component };
