import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as FINANCIAL_GOALS } from "./constants-aV2RQtvO.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as completeOnboarding, s as getMe } from "./router-JxxwALvl.mjs";
import { t as BrandLink } from "./brand-B0N51Sly.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as useCurrentUserState } from "./use-current-user-Cfaybt7U.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { o as parseMoneyInput } from "./format-ByvtKy4h.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-G_8H-An3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const nav = useNavigate();
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe(),
		enabled: Boolean(user)
	});
	const [income, setIncome] = (0, import_react.useState)("");
	const [goal, setGoal] = (0, import_react.useState)("organizar");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center",
		children: "Carregando…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me.data?.onboardingCompleted) {
		nav({ to: "/app" });
		return null;
	}
	async function onSubmit(e) {
		e.preventDefault();
		const parsed = parseMoneyInput(income);
		if (parsed == null && income.trim() !== "0" && income.trim() !== "0,00") {
			setError("Informe sua renda mensal.");
			return;
		}
		setLoading(true);
		try {
			await completeOnboarding({ data: {
				monthlyIncome: parsed ?? 0,
				financialGoal: goal
			} });
			nav({ to: "/app" });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível salvar.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 text-2xl font-semibold",
				children: "Configuração inicial"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Essas informações ficam no seu perfil e ajudam a organizar o painel. Você pode alterá-las depois."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-4",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "income",
						children: "Qual sua renda mensal?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "income",
						className: "mt-1.5",
						inputMode: "decimal",
						placeholder: "0,00",
						value: income,
						onChange: (e) => setIncome(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm font-medium",
						children: "Qual é seu principal objetivo financeiro?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid gap-2",
						children: FINANCIAL_GOALS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "radio",
								name: "goal",
								value: g.id,
								checked: goal === g.id,
								onChange: () => setGoal(g.id),
								className: "accent-primary"
							}), g.label]
						}, g.id))
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-expense",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: loading,
						children: loading ? "Salvando…" : "Ir para o painel"
					})
				]
			})
		]
	});
}
//#endregion
export { Onboarding as component };
