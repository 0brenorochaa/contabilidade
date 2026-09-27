import { b as Link, g as Outlet, p as useRouterState, x as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-WuDAn4c5.mjs";
import { i as signOut } from "./client-1vAx-gM_.mjs";
import { _ as LayoutDashboard, c as Shield, d as ScrollText, r as Users } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as getMe } from "./router-JxxwALvl.mjs";
import { t as BrandLink } from "./brand-B0N51Sly.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as useCurrentUserState } from "./use-current-user-Cfaybt7U.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Cr1ffItq.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin",
		label: "Painel",
		icon: LayoutDashboard
	},
	{
		to: "/admin/usuarios",
		label: "Usuários",
		icon: Users
	},
	{
		to: "/admin/auditoria",
		label: "Auditoria",
		icon: ScrollText
	}
];
function AdminShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const me = useQuery({
		queryKey: ["me"],
		queryFn: () => getMe(),
		enabled: Boolean(user)
	});
	const passwordGate = pathname === "/admin/senha";
	if (isPending || user && me.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center",
		children: "Carregando…"
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (me.data && me.data.role !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center p-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Acesso administrativo não autorizado." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app",
				children: "Voltar"
			})
		})] })
	});
	if (me.data?.mustChangePassword && !passwordGate) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin/senha" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "fixed inset-y-0 left-0 hidden w-56 border-r border-border bg-sidebar p-4 md:flex md:flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLink, { compact: true }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3" }), " Área administrativa"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mt-6 flex flex-1 flex-col gap-1",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const active = item.to === "/admin" ? pathname === "/admin" : pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm", active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					className: "mb-2 text-sm text-muted-foreground hover:text-foreground",
					children: "Ir ao app"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-left text-sm text-muted-foreground",
					onClick: () => void signOut("/"),
					children: "Sair"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:pl-56",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between border-b border-border px-4 py-3 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLink, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					className: "text-sm",
					children: "App"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 py-5 md:px-6",
				children
			})]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
//#endregion
export { SplitComponent as component };
