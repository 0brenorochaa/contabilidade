import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { C as useRouter, _ as lazyRouteComponent, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { M as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as createServerFn, s as __exportAll } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { n as APP_NAME, r as APP_SLOGAN } from "./constants-aV2RQtvO.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as auth } from "./server-Bgr-1Szw.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { a as TriangleAlert } from "../_libs/lucide-react.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-JxxwALvl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "Ocorreu um erro inesperado. Recarregue a página.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-expense",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Algo deu errado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted-foreground",
				children: errorMessage(error)
			})
		]
	});
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var ThemeContext = (0, import_react.createContext)({
	theme: "system",
	setTheme: () => {}
});
function applyTheme(theme) {
	const root = document.documentElement;
	const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
	const dark = theme === "dark" || theme === "system" && prefersDark;
	root.classList.toggle("dark", dark);
}
function ThemeProvider({ children }) {
	const [theme, setThemeState] = (0, import_react.useState)("system");
	(0, import_react.useEffect)(() => {
		const stored = localStorage.getItem("fintrack-theme");
		if (stored === "light" || stored === "dark" || stored === "system") {
			setThemeState(stored);
			applyTheme(stored);
		} else applyTheme("system");
	}, []);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			if (theme === "system") applyTheme("system");
		};
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, [theme]);
	const setTheme = (t) => {
		setThemeState(t);
		localStorage.setItem("fintrack-theme", t);
		applyTheme(t);
	};
	const value = (0, import_react.useMemo)(() => ({
		theme,
		setTheme
	}), [theme]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value,
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function makeQueryClient() {
	return new QueryClient({ defaultOptions: { queries: {
		staleTime: 15e3,
		refetchOnWindowFocus: false,
		retry: 1
	} } });
}
var bootstrapApp = createServerFn({ method: "POST" }).handler(createSsrRpc("eb4deefc910625e3c2922b2ca1ff7e9b60e903af91b81f1095b689edeecafab2"));
var getMe = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e24b84f6107950e4c242209ad8eec7226d939eb1de5137b410acd5b96dc18d53"));
var savePhone = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("42762a0dd15439420dd1857dc8662866dcddf5dae53e2b593e4164c9d41dafb9"));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2afc58f2e961aeb80146aaf9a3269ced6025b87cbcffa8bdbda0b0f9b9237ad4"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("70f7e0d6d1208b4cbf51a55c650316c64674d3c46651ffe197bc28dd2daa0d6d"));
var updateSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("26e7b6aab0ad63a2232ef2641f5dfb19d7bf028ebe66b7261189bf1d8dfae289"));
var markPasswordChanged = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("a227e1f4199a29004cba8866f7f4a83cbd3d7e0031e52822815c808e521bdbcd"));
var revokeAllSessions = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("50b38b631a442d7fcaf9b06dd4bb3efd7c35eeffca2eba62f0c05f78d0858c58"));
var requestPasswordReset = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("711340b9dd018cae1f6f4d42e888880dae9eee480163bae1504c47ddc10fde21"));
var confirmPasswordReset = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("eea59c053ef9abc18dcaa077fcca69fe5490f289052e33ebfb12da020b1aa87f"));
var listNotifications = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b9240a8b634e20ac46a9db5016d9f599a7ae690149cc45224a57ed1bec9a7abf"));
var markNotificationsRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("0e9dc92c3f3aed591d44f8add7a17263b72bca735939ad87a90bb597b47c7eb0"));
var exportMyData = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2a7762ddc3c799479176297d62c0f9daf302495b8e23a90ae3df225d03dc194d"));
var deleteMyAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("8c3a37e976f41e7733c0932240adfd595d2c8eb872301302ab1a9fafd587bb2b"));
var styles_default = "/assets/styles-DQVmZIHH.css";
var Route$22 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: `${APP_NAME} — ${APP_SLOGAN}` },
			{
				name: "description",
				content: "Tenha uma visão clara das suas finanças, controle seus gastos e organize seu futuro financeiro."
			},
			{
				name: "theme-color",
				content: "#0D7A5F"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: Root
});
function Bootstrap() {
	(0, import_react.useEffect)(() => {
		bootstrapApp();
	}, []);
	return null;
}
function Root() {
	const [queryClient] = (0, import_react.useState)(() => makeQueryClient());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
				client: queryClient,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bootstrap, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
						richColors: true,
						position: "top-center"
					})
				]
			}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$20 = () => import("./routes-DlLCLgMM.mjs");
var Route$21 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./admin-Cr1ffItq.mjs");
var Route$20 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./app-CI-glAqA.mjs");
var Route$19 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./cadastro-DI6Zt-_r.mjs");
var Route$18 = createFileRoute("/cadastro")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./login-A71rmi0V.mjs");
var Route$17 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./onboarding-G_8H-An3.mjs");
var Route$16 = createFileRoute("/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./recuperar-senha-CFv27Dm1.mjs");
var Route$15 = createFileRoute("/recuperar-senha")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin-DWQf9BWr.mjs");
var Route$14 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./auditoria-a5L2EIE1.mjs");
var Route$13 = createFileRoute("/admin/auditoria")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./senha-KrqG5hOr.mjs");
var Route$12 = createFileRoute("/admin/senha")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./usuarios-CiEo5xqs.mjs");
var Route$11 = createFileRoute("/admin/usuarios")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./app-CcVYS9zK.mjs");
var Route$10 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./configuracoes-DS359gV4.mjs");
var Route$9 = createFileRoute("/app/configuracoes")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./contas-B4xsn78B.mjs");
var Route$8 = createFileRoute("/app/contas")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./graficos-CuF3AJqC.mjs");
var Route$7 = createFileRoute("/app/graficos")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./historico-D72OP3ci.mjs");
var Route$6 = createFileRoute("/app/historico")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./insights-DLqXST-4.mjs");
var Route$5 = createFileRoute("/app/insights")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./metas-kWn0M9TA.mjs");
var Route$4 = createFileRoute("/app/metas")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./notificacoes-BcFSZL78.mjs");
var Route$3 = createFileRoute("/app/notificacoes")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./orcamento-Dx65YIWt.mjs");
var Route$2 = createFileRoute("/app/orcamento")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./perfil-CInz1Rnj.mjs");
var Route$1 = createFileRoute("/app/perfil")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$22
});
var AdminRoute = Route$20.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$22
});
var AppRoute = Route$19.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$22
});
var CadastroRoute = Route$18.update({
	id: "/cadastro",
	path: "/cadastro",
	getParentRoute: () => Route$22
});
var LoginRoute = Route$17.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$22
});
var OnboardingRoute = Route$16.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$22
});
var RecuperarSenhaRoute = Route$15.update({
	id: "/recuperar-senha",
	path: "/recuperar-senha",
	getParentRoute: () => Route$22
});
var AdminIndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAuditoriaRoute = Route$13.update({
	id: "/auditoria",
	path: "/auditoria",
	getParentRoute: () => AdminRoute
});
var AdminSenhaRoute = Route$12.update({
	id: "/senha",
	path: "/senha",
	getParentRoute: () => AdminRoute
});
var AdminUsuariosRoute = Route$11.update({
	id: "/usuarios",
	path: "/usuarios",
	getParentRoute: () => AdminRoute
});
var AppIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppConfiguracoesRoute = Route$9.update({
	id: "/configuracoes",
	path: "/configuracoes",
	getParentRoute: () => AppRoute
});
var AppContasRoute = Route$8.update({
	id: "/contas",
	path: "/contas",
	getParentRoute: () => AppRoute
});
var AppGraficosRoute = Route$7.update({
	id: "/graficos",
	path: "/graficos",
	getParentRoute: () => AppRoute
});
var AppHistoricoRoute = Route$6.update({
	id: "/historico",
	path: "/historico",
	getParentRoute: () => AppRoute
});
var AppInsightsRoute = Route$5.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => AppRoute
});
var AppMetasRoute = Route$4.update({
	id: "/metas",
	path: "/metas",
	getParentRoute: () => AppRoute
});
var AppNotificacoesRoute = Route$3.update({
	id: "/notificacoes",
	path: "/notificacoes",
	getParentRoute: () => AppRoute
});
var AppOrcamentoRoute = Route$2.update({
	id: "/orcamento",
	path: "/orcamento",
	getParentRoute: () => AppRoute
});
var AppPerfilRoute = Route$1.update({
	id: "/perfil",
	path: "/perfil",
	getParentRoute: () => AppRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$22
});
var AdminRouteChildren = {
	AdminAuditoriaRoute,
	AdminSenhaRoute,
	AdminUsuariosRoute,
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var AppRouteChildren = {
	AppConfiguracoesRoute,
	AppContasRoute,
	AppGraficosRoute,
	AppHistoricoRoute,
	AppInsightsRoute,
	AppMetasRoute,
	AppNotificacoesRoute,
	AppOrcamentoRoute,
	AppPerfilRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	CadastroRoute,
	LoginRoute,
	OnboardingRoute,
	RecuperarSenhaRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$22._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { deleteMyAccount as a, listNotifications as c, requestPasswordReset as d, revokeAllSessions as f, useTheme as g, updateSettings as h, confirmPasswordReset as i, markNotificationsRead as l, updateProfile as m, bootstrapApp as n, exportMyData as o, savePhone as p, completeOnboarding as r, getMe as s, router_exports as t, markPasswordChanged as u };
