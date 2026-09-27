import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as PERIODS } from "./constants-aV2RQtvO.mjs";
import { t as Input } from "./input-BUwnZFBL.mjs";
import { t as Label } from "./label-D5FchnIN.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DtIctiK3.mjs";
import { t as useAppStore } from "./store-CEa72zWv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/period-filter-CoZfxcST.js
var import_jsx_runtime = require_jsx_runtime();
function PeriodFilter() {
	const period = useAppStore((s) => s.period);
	const customFrom = useAppStore((s) => s.customFrom);
	const customTo = useAppStore((s) => s.customTo);
	const setPeriod = useAppStore((s) => s.setPeriod);
	const setCustom = useAppStore((s) => s.setCustom);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 sm:flex-row sm:items-end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-48 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "period",
				children: "Período"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: period,
				onValueChange: (v) => setPeriod(v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					id: "period",
					className: "mt-1.5",
					"aria-label": "Selecionar período",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PERIODS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: p.id,
					children: p.label
				}, p.id)) })]
			})]
		}), period === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid flex-1 grid-cols-2 gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "from",
				children: "De"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "from",
				type: "date",
				className: "mt-1.5",
				value: customFrom,
				onChange: (e) => setCustom(e.target.value, customTo)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: "to",
				children: "Até"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "to",
				type: "date",
				className: "mt-1.5",
				value: customTo,
				onChange: (e) => setCustom(customFrom, e.target.value)
			})] })]
		}) : null]
	});
}
//#endregion
export { PeriodFilter as t };
