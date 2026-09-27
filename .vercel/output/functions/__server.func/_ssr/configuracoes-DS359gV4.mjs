import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as signOut, t as authClient } from "./client-1vAx-gM_.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as deleteMyAccount, f as revokeAllSessions, g as useTheme, h as updateSettings, o as exportMyData, s as getMe, u as markPasswordChanged } from "./router-JxxwALvl.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as passwordHintText, t as isStrongPassword } from "./password-BFD6B2Tf.mjs";
import { t as Switch } from "./switch-0H6xosTq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracoes-DS359gV4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Configuracoes() {
	const qc = useQueryClient();
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe()
	});
	const { theme, setTheme } = useTheme();
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const saveTheme = async (next) => {
		setTheme(next);
		await updateSettings({ data: { theme: next } });
		await qc.invalidateQueries({ queryKey: ["me"] });
	};
	const toggleNotes = async (value) => {
		await updateSettings({ data: { notificationsEnabled: value } });
		await qc.invalidateQueries({ queryKey: ["me"] });
	};
	async function changePassword(e) {
		e.preventDefault();
		if (!isStrongPassword(newPassword)) {
			toast.error(passwordHintText(newPassword));
			return;
		}
		const { error } = await authClient.changePassword({
			currentPassword,
			newPassword,
			revokeOtherSessions: true
		});
		if (error) {
			toast.error("Não foi possível alterar a senha.");
			return;
		}
		await markPasswordChanged();
		toast.success("Senha alterada. Outras sessões foram encerradas.");
		setCurrentPassword("");
		setNewPassword("");
	}
	const download = useMutation({
		mutationFn: async (format) => {
			const res = await exportMyData({ data: { format } });
			const blob = "encoding" in res && res.encoding === "base64" ? new Blob([Uint8Array.from(atob(res.content), (c) => c.charCodeAt(0))], { type: res.mime }) : new Blob([res.content], { type: res.mime });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = res.filename;
			a.click();
			URL.revokeObjectURL(url);
		},
		onError: () => toast.error("Não foi possível exportar.")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Configurações"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Aparência"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						"light",
						"dark",
						"system"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: theme === t ? "default" : "outline",
						onClick: () => void saveTheme(t),
						children: t === "light" ? "Claro" : t === "dark" ? "Escuro" : "Automático"
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Moeda e data"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Padrão: BRL — R$ · Datas em DD/MM/AAAA · Idioma: Português do Brasil"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Notificações"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mt-3 flex items-center gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: me.data?.notificationsEnabled ?? true,
						onCheckedChange: (v) => void toggleNotes(v)
					}), "Ativar notificações"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Segurança"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 grid max-w-md gap-3",
						onSubmit: changePassword,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "cur",
								children: "Senha atual"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "cur",
								type: "password",
								className: "mt-1.5",
								value: currentPassword,
								onChange: (e) => setCurrentPassword(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "neu",
								children: "Nova senha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "neu",
								type: "password",
								className: "mt-1.5",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-fit",
								children: "Alterar senha"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-4",
						onClick: async () => {
							await revokeAllSessions();
							toast.success("Sessões encerradas.");
							await signOut("/login");
						},
						children: "Encerrar todas as sessões"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Privacidade"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Exporte apenas os seus dados. Nunca os de outra pessoa."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => download.mutate("csv"),
							disabled: download.isPending,
							children: "Exportar CSV"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => download.mutate("pdf"),
							disabled: download.isPending,
							children: "Exportar PDF"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						className: "mt-6",
						onClick: async () => {
							if (!window.confirm("Excluir sua conta e todos os dados? Esta ação não pode ser desfeita.")) return;
							await deleteMyAccount();
							await signOut("/");
						},
						children: "Excluir conta"
					})
				]
			})
		]
	});
}
//#endregion
export { Configuracoes as component };
