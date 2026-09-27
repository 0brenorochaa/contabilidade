import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

describe("per-user isolation in server queries", () => {
  const files = [
    "src/lib/server/finance.ts",
    "src/lib/server/goals.ts",
    "src/lib/server/budget.ts",
    "src/lib/server/user.ts",
  ];

  it("scopes mutating queries to context.userId", () => {
    for (const file of files) {
      const src = readFileSync(new URL("../../../" + file, import.meta.url), "utf8");
      const updates = src.match(/update\s+\w+[\s\S]*?;/gi) ?? [];
      for (const stmt of updates) {
        if (
          stmt.includes("audit_logs") ||
          stmt.includes('"user"') ||
          stmt.includes("password_reset_tokens") ||
          stmt.includes("update account")
        ) {
          continue;
        }
        assert.match(
          stmt,
          /user_id = \$\{context\.userId\}|where id = \$\{context\.userId\}|"userId" = \$\{context\.userId\}/,
          `Unscoped update in ${file}: ${stmt.slice(0, 160)}`,
        );
      }
      const deletes = src.match(/delete from\s+\w+[\s\S]*?;/gi) ?? [];
      for (const stmt of deletes) {
        if (stmt.includes("session") || stmt.includes("password_reset_tokens") || stmt.includes('"user"')) continue;
        assert.match(
          stmt,
          /user_id = \$\{context\.userId\}|"userId" = \$\{context\.userId\}/,
          `Unscoped delete in ${file}: ${stmt.slice(0, 160)}`,
        );
      }
    }
  });

  it("admin module requires requireAdmin", () => {
    const src = readFileSync(new URL("./admin.ts", import.meta.url), "utf8");
    const handlers = src.match(/\.handler\(async/g) ?? [];
    const guards = src.match(/requireAdmin\(/g) ?? [];
    assert.ok(handlers.length > 0);
    assert.equal(handlers.length, guards.length);
  });

  it("does not expose admin bootstrap password on the client", () => {
    const login = readFileSync(new URL("../../routes/login.tsx", import.meta.url), "utf8");
    assert.doesNotMatch(login, /FinTrack@Admin2026!/);
    assert.doesNotMatch(login, /ADMIN_INITIAL_PASSWORD/);
  });
});
