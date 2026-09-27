import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { m as Pencil, s as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { a as incomeSourceLabel, i as formatMoney, n as formatDateBR } from "./format-ByvtKy4h.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DtIctiK3.mjs";
import { a as deleteTransaction, c as listCategories, l as listTransactions } from "./finance-B8dL9te4.mjs";
import { t as useAppStore } from "./store-CEa72zWv.mjs";
import { t as EmptyState } from "./empty-state-DqIfo5Ga.mjs";
import { t as PeriodFilter } from "./period-filter-CoZfxcST.mjs";
import { t as Badge } from "./badge-CovJ2NWu.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-CUEEE1ne.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/historico-D72OP3ci.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Historico() {
	const period = useAppStore((s) => s.period);
	const from = useAppStore((s) => s.customFrom);
	const to = useAppStore((s) => s.customTo);
	const openAdd = useAppStore((s) => s.openAdd);
	const openEdit = useAppStore((s) => s.openEdit);
	const [query, setQuery] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const [categoryId, setCategoryId] = (0, import_react.useState)("");
	const [place, setPlace] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("date");
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const qc = useQueryClient();
	const cats = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategories()
	});
	const list = useQuery({
		queryKey: [
			"transactions",
			period,
			from,
			to,
			query,
			type,
			categoryId,
			place,
			sort
		],
		queryFn: () => listTransactions({ data: {
			period,
			from,
			to,
			query,
			type,
			categoryId: categoryId || void 0,
			place,
			sort
		} })
	});
	const remove = useMutation({
		mutationFn: (id) => deleteTransaction({ data: { id } }),
		onSuccess: async () => {
			toast.success("Movimentação excluída.");
			setPendingDelete(null);
			await Promise.all([
				qc.invalidateQueries({ queryKey: ["transactions"] }),
				qc.invalidateQueries({ queryKey: ["dashboard"] }),
				qc.invalidateQueries({ queryKey: ["budget"] })
			]);
		},
		onError: (e) => toast.error(e.message)
	});
	const items = list.data?.items ?? [];
	const empty = (0, import_react.useMemo)(() => !list.isPending && items.length === 0, [list.isPending, items.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Histórico"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Pesquise e combine filtros. A exclusão pede confirmação."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 md:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Pesquisar descrição, loja ou valor",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						"aria-label": "Pesquisar"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onValueChange: (v) => setType(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							"aria-label": "Tipo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Todos os tipos"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "income",
								children: "Receitas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "expense",
								children: "Despesas"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: categoryId || "all",
						onValueChange: (v) => setCategoryId(v === "all" ? "" : v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							"aria-label": "Categoria",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Categoria" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Todas as categorias"
						}), (cats.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: c.id,
							children: c.name
						}, c.id))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Filtrar por loja",
						value: place,
						onChange: (e) => setPlace(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sort,
						onValueChange: (v) => setSort(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							"aria-label": "Ordenar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "date",
								children: "Mais recente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "amount_desc",
								children: "Maior valor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "amount_asc",
								children: "Menor valor"
							})
						] })]
					})
				]
			}),
			list.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando…"
			}) : null,
			empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nenhuma movimentação neste filtro",
				description: "Ajuste a pesquisa ou registre uma nova movimentação.",
				action: {
					label: "Adicionar",
					onClick: () => openAdd()
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border rounded-xl border border-border bg-card",
				children: items.map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-wrap items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: tx.type === "income" ? "grid size-10 place-items-center rounded-md bg-accent text-income" : "grid size-10 place-items-center rounded-md bg-destructive/10 text-expense",
							"aria-hidden": true,
							children: tx.type === "income" ? "+" : "−"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: tx.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									tx.place || (tx.incomeSource ? incomeSourceLabel(tx.incomeSource) : "—"),
									" · ",
									formatDateBR(tx.occurredOn)
								]
							})]
						}),
						tx.categoryName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: tx.categoryName
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: tx.type === "income" ? "font-semibold text-income tabular" : "font-semibold text-expense tabular",
							children: formatMoney(tx.amount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Editar",
								onClick: () => openEdit(tx),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Excluir",
								onClick: () => setPendingDelete(tx.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						})
					]
				}, tx.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: Boolean(pendingDelete),
				onOpenChange: (o) => !o && setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Excluir movimentação?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Essa ação não pode ser desfeita." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => pendingDelete && remove.mutate(pendingDelete),
					children: "Excluir"
				})] })] })
			})
		]
	});
}
//#endregion
export { Historico as component };
