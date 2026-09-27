import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { n as listAuditLogs, r as listSystemErrors } from "./admin-DULpBvHo.mjs";
import { r as formatDateTimeBR } from "./format-ByvtKy4h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditoria-a5L2EIE1.js
var import_jsx_runtime = require_jsx_runtime();
function Auditoria() {
	const logs = useQuery({
		queryKey: ["audit"],
		queryFn: () => listAuditLogs()
	});
	const errors = useQuery({
		queryKey: ["syserr"],
		queryFn: () => listSystemErrors()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Auditoria"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Ações administrativas e erros do sistema. Senhas e tokens nunca são registrados."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-semibold",
				children: "Logs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2",
				children: (logs.data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: l.action
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								l.actor_email ?? "sistema",
								" · ",
								l.result,
								" · ",
								formatDateTimeBR(l.created_at)
							]
						}),
						l.details ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted-foreground",
							children: l.details
						}) : null
					]
				}) }, l.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-semibold",
				children: "Erros do sistema"
			}), (errors.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Nenhum erro recente."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2",
				children: (errors.data ?? []).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md border border-border bg-card p-3 text-sm",
					children: [e.message, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted-foreground",
						children: formatDateTimeBR(e.created_at)
					})]
				}, e.id))
			})] })
		]
	});
}
//#endregion
export { Auditoria as component };
