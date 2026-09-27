import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as requestPasswordReset, i as confirmPasswordReset } from "./router-JxxwALvl.mjs";
import { t as BrandLink } from "./brand-B0N51Sly.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as passwordHintText, t as isStrongPassword } from "./password-BFD6B2Tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recuperar-senha-CFv27Dm1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Recuperar() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [token, setToken] = (0, import_react.useState)(null);
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(false);
	async function request(e) {
		e.preventDefault();
		setError("");
		setMessage("");
		setLoading(true);
		try {
			const res = await requestPasswordReset({ data: {
				email,
				phone
			} });
			if (res.token) {
				setToken(res.token);
				setMessage("Dados confirmados. Defina uma nova senha.");
			} else setMessage("Se os dados estiverem corretos, a redefinição será liberada. Confira e-mail e telefone cadastrados.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível continuar.");
		} finally {
			setLoading(false);
		}
	}
	async function confirm(e) {
		e.preventDefault();
		if (!token) return;
		if (!isStrongPassword(password)) return setError(passwordHintText(password));
		setLoading(true);
		setError("");
		try {
			await confirmPasswordReset({ data: {
				token,
				password
			} });
			setDone(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Não foi possível redefinir a senha.");
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
				children: "Recuperar senha"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Confirme o e-mail e o telefone cadastrados. Não revelamos se uma conta existe."
			}),
			done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Senha atualizada. Você já pode entrar com a nova senha." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Ir para o login"
					})
				})]
			}) : token ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3",
				onSubmit: confirm,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "password",
						children: "Nova senha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "password",
						type: "password",
						className: "mt-1.5",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						required: true
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-expense",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: loading,
						children: loading ? "Salvando…" : "Redefinir senha"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3",
				onSubmit: request,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "E-mail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						type: "email",
						className: "mt-1.5",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "phone",
						children: "Telefone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "phone",
						className: "mt-1.5",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						required: true
					})] }),
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: message
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-expense",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: loading,
						children: loading ? "Verificando…" : "Continuar"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "mt-6 text-sm text-primary hover:underline",
				children: "Voltar ao login"
			})
		]
	});
}
//#endregion
export { Recuperar as component };
