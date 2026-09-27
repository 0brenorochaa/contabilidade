import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-B897pzxd.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-B8dL9te4.js
var listTransactions = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("e03546459a130f53aa8fe4aef82ec86cf742ced71ca1395f82de3ec35150c401"));
var getDashboard = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("e444e7f884fcf1f9bfa22af7d4a97a2528b4656f3de05ed9a63eba9aed1103ed"));
var createTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("c958703034ee99aaa99769552a2d02c16657c3430140290d615229cf0639491b"));
var updateTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("ce2feeff4a5f353e5b9261a4cfce317a1a4f7d5cab9747dc123efd4542a4e616"));
var deleteTransaction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("88ba13589545508c1e6bc130638a70dc42613a84254861d6b86e22e4eb7673c3"));
var listCategories = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("2eebafa84d8f72df96e0f03b2b82fdeea1b8e99e2da192f291b0066803edf4cc"));
var createCategory = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("2cdc384dd70d4ccdc1e39637f77018d372657057688c01697b2bb99aebceee08"));
var listAccounts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("64b8df86a53ab27f09477ed713502a0b42f16df5a50e50650ece9358bf98a8c3"));
var createAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("10eb36b9c2c0f27bd16ced5e222e973f56bb94dada7684028f56773baf094688"));
var deleteAccount = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((data) => data).handler(createSsrRpc("307a43cbbe2c3721ddc1240a6743d39fde8cc8ae82ef221970b83a7b4300d9b4"));
//#endregion
export { deleteTransaction as a, listCategories as c, deleteAccount as i, listTransactions as l, createCategory as n, getDashboard as o, createTransaction as r, listAccounts as s, createAccount as t, updateTransaction as u };
