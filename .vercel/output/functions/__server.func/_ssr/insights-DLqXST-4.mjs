import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Card } from "./card-kZqPbQDd.mjs";
import { o as getDashboard } from "./finance-B8dL9te4.mjs";
import { t as useAppStore } from "./store-CEa72zWv.mjs";
import { t as PeriodFilter } from "./period-filter-CoZfxcST.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-DLqXST-4.js
var import_jsx_runtime = require_jsx_runtime();
function Insights() {
	const period = useAppStore((s) => s.period);
	const from = useAppStore((s) => s.customFrom);
	const to = useAppStore((s) => s.customTo);
	const dash = useQuery({
		queryKey: [
			"dashboard",
			period,
			from,
			to
		],
		queryFn: () => getDashboard({ data: {
			period,
			from,
			to
		} })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold",
				children: "Insights"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Observações informativas com base nos seus dados. Sem recomendações de investimento."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PeriodFilter, {})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: (dash.data?.insights ?? []).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: i.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: i.body
				})]
			}, i.id))
		})]
	});
}
//#endregion
export { Insights as component };
