import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { clampProgress, netBalance, suggestedMonthlySaving } from "./money.ts";
import { budgetAlertLevel, budgetRemaining, budgetUsage } from "./budget.ts";
import { buildInsights } from "./insights.ts";
import { isStrongPassword, isValidEmail, isValidPhone, passwordIssues } from "./password.ts";

describe("balance", () => {
  it("calculates receitas - despesas", () => {
    assert.equal(netBalance(1500, 250.5), 1249.5);
  });
  it("starts at zero", () => {
    assert.equal(netBalance(0, 0), 0);
  });
});

describe("goals", () => {
  it("clamps progress", () => {
    assert.equal(clampProgress(2500, 5000), 50);
    assert.equal(clampProgress(9000, 5000), 100);
    assert.equal(clampProgress(0, 0), 0);
  });
  it("suggests monthly saving without calling it investment advice", () => {
    assert.equal(suggestedMonthlySaving(3000, 6), 500);
    assert.equal(suggestedMonthlySaving(100, 0), null);
  });
});

describe("budget", () => {
  it("flags 80%, 100% and over", () => {
    assert.equal(budgetAlertLevel(790, 1000), "none");
    assert.equal(budgetAlertLevel(800, 1000), "warn");
    assert.equal(budgetAlertLevel(1000, 1000), "limit");
    assert.equal(budgetAlertLevel(1000.01, 1000), "over");
  });
  it("computes remaining", () => {
    assert.equal(budgetRemaining(750, 1000), 250);
    assert.equal(budgetUsage(750, 1000), 75);
  });
});

describe("password and contact validation", () => {
  it("rejects weak passwords", () => {
    assert.ok(passwordIssues("abc").includes("min"));
    assert.equal(isStrongPassword("FinTrack@Admin2026!"), true);
    assert.equal(isStrongPassword("password"), false);
  });
  it("validates email and phone", () => {
    assert.equal(isValidEmail("ada@fintrack.app"), true);
    assert.equal(isValidEmail("invalido"), false);
    assert.equal(isValidPhone("(11) 98888-7777"), true);
    assert.equal(isValidPhone("123"), false);
  });
});

describe("insights", () => {
  it("uses empty copy when there is no data", () => {
    const items = buildInsights({
      periodIncome: 0,
      periodExpense: 0,
      prevIncome: 0,
      prevExpense: 0,
      topCategory: null,
      topCategoryAmount: 0,
      topGoal: null,
      hasAnyData: false,
    });
    assert.equal(items[0]?.id, "empty");
  });
  it("reports spent less and top category from real numbers", () => {
    const items = buildInsights({
      periodIncome: 3000,
      periodExpense: 900,
      prevIncome: 3000,
      prevExpense: 1200,
      topCategory: "Alimentação",
      topCategoryAmount: 400,
      topGoal: { name: "Reserva", current: 2500, target: 5000 },
      hasAnyData: true,
    });
    assert.ok(items.some((i) => i.id === "spent-less"));
    assert.ok(items.some((i) => i.body.includes("Alimentação")));
    assert.ok(items.some((i) => i.body.includes("50%")));
  });
});
