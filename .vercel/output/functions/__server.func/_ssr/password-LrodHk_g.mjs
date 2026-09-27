import { i as verifyPassword, r as hashPassword } from "../_libs/better-auth__utils.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/password-LrodHk_g.js
function env(key) {
	return process.env[key]?.trim() || void 0;
}
/**
* Workspace preview vs deployed app. The deployer writes GROK_PROJECT_ID on
* every publish; the sandbox preview never has it. Single source of truth for
* the split — gate audience, gate endpoints and connector-token semantics all
* key off this predicate.
*/
function isWorkspacePreview() {
	return !env("GROK_PROJECT_ID");
}
/**
* `@better-auth/utils/password` uses the "node" export condition in package.json
* to automatically pick the right implementation:
*   - Node.js / Bun / Deno → `node:crypto scrypt` (libuv thread pool, non-blocking)
*   - Unsupported runtimes → `@noble/hashes scrypt` (pure JS fallback)
*/
var hashPassword$1 = hashPassword;
var verifyPassword$1 = async ({ hash, password }) => {
	return verifyPassword(hash, password);
};
//#endregion
export { verifyPassword$1 as i, hashPassword$1 as n, isWorkspacePreview as r, env as t };
