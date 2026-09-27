import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useNavigate, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as authClient } from "./client-1vAx-gM_.mjs";
import { p as savePhone } from "./router-JxxwALvl.mjs";
import { t as BrandLink } from "./brand-B0N51Sly.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as passwordHintText, n as isValidEmail, r as isValidPhone, t as isStrongPassword } from "./password-BFD6B2Tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cadastro-DI6Zt-_r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Cadastro() {
	const nav = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		if (name.trim().length < 2) return setError("Informe seu nome.");
		if (!isValidEmail(email)) return setError("Informe um e-mail válido.");
		if (!isValidPhone(phone)) return setError("Informe um telefone válido.");
		if (!isStrongPassword(password)) return setError(passwordHintText(password));
		setLoading(true);
		try {
			const { error: err } = await authClient.signUp.email({
				name: name.trim(),
				email: email.trim().toLowerCase(),
				password,
				callbackURL: "/onboarding"
			});
			if (err) {
				setError("Não foi possível criar a conta. Se o e-mail já estiver em uso, tente entrar.");
				return;
			}
			try {
				await savePhone({ data: { phone } });
			} catch {}
			nav({ to: "/onboarding" });
		} catch {
			setError("Não foi possível criar a conta. Tente novamente.");
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
				children: "Criar conta"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Comece sem movimentações fictícias. Seu saldo inicia em R$ 0,00."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Nome"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						className: "mt-1.5",
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true
					})] }),
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
						inputMode: "tel",
						value: phone,
						onChange: (e) => setPhone(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							children: "Senha"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "password",
							type: "password",
							className: "mt-1.5",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Mínimo de 8 caracteres, com maiúscula, minúscula, número e caractere especial."
						})
					] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-expense",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: loading,
						children: loading ? "Criando…" : "Criar conta"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [
					"Já tem conta?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-medium text-primary hover:underline",
						children: "Entrar"
					})
				]
			})
		]
	});
}
//#endregion
export { Cadastro as component };
