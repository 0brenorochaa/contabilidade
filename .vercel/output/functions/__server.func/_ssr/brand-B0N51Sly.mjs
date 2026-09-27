import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-WuDAn4c5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-B0N51Sly.js
var import_jsx_runtime = require_jsx_runtime();
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "9",
				fill: "currentColor",
				className: "text-primary"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M9 20.5c3.2-1.4 5.1-5.8 7.2-5.8 1.5 0 2.3 1.6 3.5 1.6 1.6 0 2.4-2.3 3.3-3.8",
				fill: "none",
				stroke: "white",
				strokeWidth: "2.1",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22.8",
				cy: "12.2",
				r: "1.4",
				fill: "white"
			})
		]
	});
}
function BrandLink({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-2 text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-semibold tracking-tight", compact ? "text-base" : "text-lg"),
			children: "FinTrack"
		})]
	});
}
//#endregion
export { BrandLink as t };
