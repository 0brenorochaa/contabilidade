import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as signIn, t as authClient } from "./client-1vAx-gM_.mjs";
import { t as GROK_PROVIDERS } from "./server-Bgr-1Szw.mjs";
import { n as bootstrapApp } from "./router-JxxwALvl.mjs";
import { t as BrandLink } from "./brand-B0N51Sly.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as useCurrentUserState } from "./use-current-user-Cfaybt7U.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-A71rmi0V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function resolveIdentifier(raw) {
	const value = raw.trim();
	if (value.includes("@")) return value;
	if (value.toLowerCase() === "admin") return "admin@fintrack.local";
	return value;
}
function Login() {
	const nav = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		bootstrapApp();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isPending && user) nav({ to: "/app" });
	}, [
		isPending,
		user,
		nav
	]);
	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const { error: err } = await authClient.signIn.email({
				email: resolveIdentifier(email),
				password,
				rememberMe: remember
			});
			if (err) {
				setError("Não foi possível entrar. Verifique os dados e tente novamente.");
				return;
			}
			nav({ to: "/app" });
		} catch {
			setError("Não foi possível entrar. Tente novamente.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLink, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 text-2xl font-semibold",
				children: "Entrar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Acesse sua conta FinTrack."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "E-mail ou usuário"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						className: "mt-1.5",
						autoComplete: "username",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "password",
						children: "Senha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "password",
						type: "password",
						className: "mt-1.5",
						autoComplete: "current-password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: remember,
							onChange: (e) => setRemember(e.target.checked),
							className: "size-4 accent-primary"
						}), "Manter sessão"]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-expense",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: loading,
						children: loading ? "Entrando…" : "Entrar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/recuperar-senha",
					className: "text-primary hover:underline",
					children: "Recuperar senha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Ainda não tem conta?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/cadastro",
						className: "font-medium text-primary hover:underline",
						children: "Criar conta"
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-xs text-muted-foreground",
					children: "Ou continue com"
				}), GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => signIn(p.providerId, { callbackURL: "/app" }),
					children: ["Continuar com ", p.label]
				}, p.providerId))]
			})
		]
	});
}
//#endregion
export { Login as component };
