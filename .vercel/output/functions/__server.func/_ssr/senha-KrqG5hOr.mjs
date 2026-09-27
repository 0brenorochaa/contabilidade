import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as authClient } from "./client-1vAx-gM_.mjs";
import { u as markPasswordChanged } from "./router-JxxwALvl.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as passwordHintText, t as isStrongPassword } from "./password-BFD6B2Tf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/senha-KrqG5hOr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSenha() {
	const nav = useNavigate();
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		if (!isStrongPassword(newPassword)) {
			setError(passwordHintText(newPassword));
			return;
		}
		setLoading(true);
		setError("");
		const { error: err } = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true
		});
		if (err) {
			setError("Não foi possível alterar a senha inicial.");
			setLoading(false);
			return;
		}
		await markPasswordChanged();
		nav({ to: "/admin" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Alterar senha inicial"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "No primeiro acesso administrativo a senha inicial precisa ser substituída. Ela deixa de ser válida depois desta alteração."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-3",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "cur",
						children: "Senha atual"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cur",
						type: "password",
						className: "mt-1.5",
						value: currentPassword,
						onChange: (e) => setCurrentPassword(e.target.value),
						required: true
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "neu",
						children: "Nova senha"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "neu",
						type: "password",
						className: "mt-1.5",
						value: newPassword,
						onChange: (e) => setNewPassword(e.target.value),
						required: true
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-expense",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: loading,
						children: loading ? "Salvando…" : "Salvar nova senha"
					})
				]
			})
		]
	});
}
//#endregion
export { AdminSenha as component };
