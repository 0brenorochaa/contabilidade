import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as FINANCIAL_GOALS } from "./constants-aV2RQtvO.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as updateProfile, s as getMe } from "./router-JxxwALvl.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { o as parseMoneyInput } from "./format-ByvtKy4h.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DtIctiK3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/perfil-CInz1Rnj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Perfil() {
	const qc = useQueryClient();
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [income, setIncome] = (0, import_react.useState)("");
	const [goal, setGoal] = (0, import_react.useState)("organizar");
	(0, import_react.useEffect)(() => {
		if (!me.data) return;
		setName(me.data.name);
		setPhone(me.data.phone ?? "");
		setIncome(me.data.monthlyIncome != null ? String(me.data.monthlyIncome).replace(".", ",") : "");
		setGoal(me.data.financialGoal ?? "organizar");
	}, [me.data]);
	const save = useMutation({
		mutationFn: async () => {
			await updateProfile({ data: {
				name,
				phone,
				monthlyIncome: parseMoneyInput(income) ?? 0,
				financialGoal: goal
			} });
		},
		onSuccess: async () => {
			toast.success("Perfil atualizado.");
			await qc.invalidateQueries({ queryKey: ["me"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Perfil"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Seus dados pessoais e objetivo financeiro."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid max-w-lg gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						save.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Nome"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							className: "mt-1.5",
							value: name,
							onChange: (e) => setName(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "E-mail"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							className: "mt-1.5",
							value: me.data?.email ?? "",
							readOnly: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "phone",
							children: "Telefone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							className: "mt-1.5",
							value: phone,
							onChange: (e) => setPhone(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "income",
							children: "Renda mensal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "income",
							className: "mt-1.5",
							value: income,
							onChange: (e) => setIncome(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Objetivo financeiro" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: goal,
							onValueChange: setGoal,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FINANCIAL_GOALS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: g.id,
								children: g.label
							}, g.id)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-fit",
							disabled: save.isPending,
							children: "Salvar"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/configuracoes",
						className: "text-primary hover:underline",
						children: "Configurações"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/contas",
						className: "text-primary hover:underline",
						children: "Contas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/notificacoes",
						className: "text-primary hover:underline",
						children: "Notificações"
					})
				]
			})
		]
	});
}
//#endregion
export { Perfil as component };
