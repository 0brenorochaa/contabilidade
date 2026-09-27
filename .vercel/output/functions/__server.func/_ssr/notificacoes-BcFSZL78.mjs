import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { c as listNotifications, l as markNotificationsRead } from "./router-JxxwALvl.mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { r as formatDateTimeBR } from "./format-ByvtKy4h.mjs";
import { t as EmptyState } from "./empty-state-DqIfo5Ga.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notificacoes-BcFSZL78.js
var import_jsx_runtime = require_jsx_runtime();
function Notificacoes() {
	const qc = useQueryClient();
	const notes = useQuery({
		queryKey: ["notifications"],
		queryFn: () => listNotifications()
	});
	const read = useMutation({
		mutationFn: () => markNotificationsRead(),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Notificações"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Alertas de orçamento, metas e registros importantes."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => read.mutate(),
				children: "Marcar como lidas"
			})]
		}), (notes.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Nenhuma notificação",
			description: "Avisos úteis aparecerão aqui, sem ruído desnecessário."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3",
			children: (notes.data ?? []).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: n.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: n.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: formatDateTimeBR(n.created_at)
					})
				]
			}) }, n.id))
		})]
	});
}
//#endregion
export { Notificacoes as component };
