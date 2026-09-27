import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-WuDAn4c5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-DQ0BwzAX.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ value = 0, className, indicatorClassName, ...props }) {
	const pct = Math.min(100, Math.max(0, value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "progressbar",
		"aria-valuenow": Math.round(pct),
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		className: cn("h-2 w-full overflow-hidden rounded-full bg-muted", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full bg-primary transition-[width] duration-500 ease-out", indicatorClassName),
			style: { width: `${pct}%` }
		})
	});
}
//#endregion
export { Progress as t };
