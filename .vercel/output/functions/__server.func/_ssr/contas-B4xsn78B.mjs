import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as ACCOUNT_TYPES } from "./constants-aV2RQtvO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { i as formatMoney, o as parseMoneyInput, t as accountTypeLabel } from "./format-ByvtKy4h.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DtIctiK3.mjs";
import { i as deleteAccount, s as listAccounts, t as createAccount } from "./finance-B8dL9te4.mjs";
import { t as EmptyState } from "./empty-state-DqIfo5Ga.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contas-B4xsn78B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contas() {
	const qc = useQueryClient();
	const accounts = useQuery({
		queryKey: ["accounts"],
		queryFn: () => listAccounts()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("banco");
	const [initial, setInitial] = (0, import_react.useState)("0");
	const save = useMutation({
		mutationFn: async () => {
			await createAccount({ data: {
				name,
				type,
				initialBalance: parseMoneyInput(initial) ?? 0
			} });
		},
		onSuccess: async () => {
			toast.success("Conta cadastrada.");
			setName("");
			await qc.invalidateQueries({ queryKey: ["accounts"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: (id) => deleteAccount({ data: { id } }),
		onSuccess: async () => {
			toast.success("Conta removida.");
			await qc.invalidateQueries({ queryKey: ["accounts"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Contas"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Opcional. Use nas movimentações quando quiser."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-3 md:grid-cols-4",
					onSubmit: (e) => {
						e.preventDefault();
						save.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "aname",
								children: "Nome"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "aname",
								className: "mt-1.5",
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tipo" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: type,
							onValueChange: setType,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ACCOUNT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t.id,
								children: t.label
							}, t.id)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "abal",
							children: "Saldo inicial"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "abal",
							className: "mt-1.5",
							value: initial,
							onChange: (e) => setInitial(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "md:col-span-4 w-fit",
							children: "Cadastrar conta"
						})
					]
				})
			}),
			(accounts.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nenhuma conta cadastrada",
				description: "Você pode registrar movimentações mesmo sem contas."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 md:grid-cols-2",
				children: (accounts.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: a.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: accountTypeLabel(a.type)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-semibold tabular",
							children: formatMoney(a.balance)
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => remove.mutate(a.id),
						children: "Excluir"
					})]
				}) }, a.id))
			})
		]
	});
}
//#endregion
export { Contas as component };
