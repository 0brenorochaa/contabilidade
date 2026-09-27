import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-piHpGyoA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/empty-state-DqIfo5Ga.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ title, description, action, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center",
		children: [
			icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-muted-foreground",
				children: icon
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted-foreground",
				children: description
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: action.onClick,
				className: "mt-2",
				children: action.label
			}) : null
		]
	});
}
//#endregion
export { EmptyState as t };
