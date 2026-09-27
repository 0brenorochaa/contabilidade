import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DULpBvHo.js
var getAdminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("36a0d6f1c97d92068a5f4a7080d0ecfcee4f0333332d0828686298ef670d6062"));
var listUsersAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2fb0171e9fa68cbd1250176d8f73c54fea6b67aead481796588fd815900d6f96"));
var updateUserAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("b752b2c6efc60f5f7c945c6b6b1c297476281fe8b5cdd4028d714bb7f4b2beaa"));
var listAuditLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("cefd777af2826db44231a01cba14377bee9dded3bb723f6de53499bba419454e"));
var listSystemErrors = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("6fcf4adb0fb777184ea039169e0bb5115e585583c841f269f5a28468ada83cc2"));
var logAdminAuthEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("1d5bea2b9a4020bfcf1f136e0c03d5d121596e257e8866705b09b942bd0dd854"));
//#endregion
export { logAdminAuthEvent as a, listUsersAdmin as i, listAuditLogs as n, updateUserAdmin as o, listSystemErrors as r, getAdminDashboard as t };
