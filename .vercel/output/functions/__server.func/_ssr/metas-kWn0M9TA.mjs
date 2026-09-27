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
import { i as formatMoney, n as formatDateBR, o as parseMoneyInput } from "./format-ByvtKy4h.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { t as EmptyState } from "./empty-state-DqIfo5Ga.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-CUEEE1ne.mjs";
import { t as Progress } from "./progress-DQ0BwzAX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/metas-kWn0M9TA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
var listGoals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("370fd8561d295fa628382d08cee9cd3d1b2393f08ba2d43295b0aa616ef6afd5"));
var createGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("f35c3d9b246ffdca4315130396b0492c3e72757afc8b079e3932db6269be2d86"));
var updateGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("b93bc2cf1baa26cafbda25b0b8837a1374197daf200d117d875ed2d4c3e7a40e"));
var contributeGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("71b44ced66666ccd2bbbd5d52f8e778d920f44f94c28ccb9707a857763d5101c"));
var deleteGoal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("719fb3e0396bebe483aa7c32c0544c9beae941db77a488030b8d16c9a9861fc1"));
function Metas() {
	const qc = useQueryClient();
	const goals = useQuery({
		queryKey: ["goals"],
		queryFn: () => listGoals()
	});
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const remove = useMutation({
		mutationFn: (id) => deleteGoal({ data: { id } }),
		onSuccess: async () => {
			toast.success("Meta excluída.");
			setPendingDelete(null);
			await qc.invalidateQueries({ queryKey: ["goals"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "Metas"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Acompanhe progresso e, se houver prazo, uma sugestão matemática de poupança mensal."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						setEditing(null);
						setFormOpen(true);
					},
					children: "Nova meta"
				})]
			}),
			formOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalForm, {
				initial: editing,
				onClose: () => {
					setFormOpen(false);
					setEditing(null);
				}
			}) : null,
			goals.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Carregando…"
			}) : null,
			!goals.isPending && (goals.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nenhuma meta ainda",
				description: "Crie uma meta com valor desejado. O progresso começa em R$ 0,00.",
				action: {
					label: "Criar meta",
					onClick: () => setFormOpen(true)
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: (goals.data ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalCard, {
					goal: g,
					onEdit: () => {
						setEditing(g);
						setFormOpen(true);
					},
					onDelete: () => setPendingDelete(g.id)
				}, g.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: Boolean(pendingDelete),
				onOpenChange: (o) => !o && setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Excluir meta?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "As contribuições desta meta também serão removidas." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancelar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: () => pendingDelete && remove.mutate(pendingDelete),
					children: "Excluir"
				})] })] })
			})
		]
	});
}
function GoalCard({ goal, onEdit, onDelete }) {
	const qc = useQueryClient();
	const [amount, setAmount] = (0, import_react.useState)("");
	const add = useMutation({
		mutationFn: async () => {
			const parsed = parseMoneyInput(amount);
			if (!parsed) throw new Error("Informe um valor válido.");
			await contributeGoal({ data: {
				id: goal.id,
				amount: parsed
			} });
		},
		onSuccess: async () => {
			setAmount("");
			toast.success("Valor adicionado à meta.");
			await qc.invalidateQueries({ queryKey: ["goals"] });
			await qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: goal.name
				}), goal.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: goal.description
				}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: onEdit,
						children: "Editar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: onDelete,
						children: "Excluir"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm tabular",
				children: [
					formatMoney(goal.currentAmount),
					" / ",
					formatMoney(goal.targetAmount)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: goal.progress,
				className: "mt-2"
			}),
			goal.deadline ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Prazo: ", formatDateBR(goal.deadline)]
			}) : null,
			goal.monthlySuggestion != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					"Para atingir o valor até a data, seria necessário guardar ",
					formatMoney(goal.monthlySuggestion),
					" por mês. Isso é apenas um cálculo, não uma recomendação de investimento."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-4 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					add.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Adicionar valor",
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					inputMode: "decimal",
					"aria-label": `Adicionar dinheiro à meta ${goal.name}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "outline",
					disabled: add.isPending,
					children: "Adicionar"
				})]
			})
		]
	});
}
function GoalForm({ initial, onClose }) {
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [target, setTarget] = (0, import_react.useState)(initial ? String(initial.targetAmount).replace(".", ",") : "");
	const [deadline, setDeadline] = (0, import_react.useState)(initial?.deadline ?? "");
	const [description, setDescription] = (0, import_react.useState)(initial?.description ?? "");
	const save = useMutation({
		mutationFn: async () => {
			const parsed = parseMoneyInput(target);
			if (!parsed) throw new Error("Informe um valor desejado válido.");
			if (initial) await updateGoal({ data: {
				id: initial.id,
				name,
				targetAmount: parsed,
				deadline: deadline || null,
				description
			} });
			else await createGoal({ data: {
				name,
				targetAmount: parsed,
				deadline: deadline || null,
				description
			} });
		},
		onSuccess: async () => {
			toast.success(initial ? "Meta atualizada." : "Meta criada.");
			await qc.invalidateQueries({ queryKey: ["goals"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-semibold",
			children: initial ? "Editar meta" : "Nova meta"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "mt-3 grid gap-3",
			onSubmit: (e) => {
				e.preventDefault();
				save.mutate();
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "gname",
					children: "Nome"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "gname",
					className: "mt-1.5",
					value: name,
					onChange: (e) => setName(e.target.value),
					required: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "gtarget",
					children: "Valor desejado"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "gtarget",
					className: "mt-1.5",
					value: target,
					onChange: (e) => setTarget(e.target.value),
					required: true
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "gdate",
					children: "Data limite (opcional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "gdate",
					type: "date",
					className: "mt-1.5",
					value: deadline,
					onChange: (e) => setDeadline(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "gdesc",
					children: "Descrição (opcional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "gdesc",
					className: "mt-1.5",
					value: description,
					onChange: (e) => setDescription(e.target.value)
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: onClose,
						children: "Cancelar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: save.isPending,
						children: "Salvar"
					})]
				})
			]
		})]
	});
}
//#endregion
export { Metas as component };
