import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CEa72zWv.js
var useAppStore = create((set) => ({
	period: "this_month",
	customFrom: "",
	customTo: "",
	addOpen: false,
	addMode: null,
	editing: null,
	setPeriod: (period) => set({ period }),
	setCustom: (customFrom, customTo) => set({
		customFrom,
		customTo,
		period: "custom"
	}),
	openAdd: (mode = null) => set({
		addOpen: true,
		addMode: mode,
		editing: null
	}),
	openEdit: (tx) => set({
		addOpen: true,
		addMode: tx.type,
		editing: tx
	}),
	closeAdd: () => set({
		addOpen: false,
		addMode: null,
		editing: null
	})
}));
//#endregion
export { useAppStore as t };
