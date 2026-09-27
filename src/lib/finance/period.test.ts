import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { previousRange, resolvePeriod } from "./period.ts";

describe("resolvePeriod", () => {
  const now = new Date(2026, 8, 27); // 27/09/2026

  it("returns this month", () => {
    const r = resolvePeriod("this_month", undefined, now);
    assert.equal(r.from, "2026-09-01");
    assert.equal(r.to, "2026-09-30");
  });

  it("returns last month", () => {
    const r = resolvePeriod("last_month", undefined, now);
    assert.equal(r.from, "2026-08-01");
    assert.equal(r.to, "2026-08-31");
  });

  it("returns last 7 days inclusive", () => {
    const r = resolvePeriod("last_7", undefined, now);
    assert.equal(r.from, "2026-09-21");
    assert.equal(r.to, "2026-09-27");
  });

  it("swaps inverted custom range", () => {
    const r = resolvePeriod("custom", { from: "2026-09-20", to: "2026-09-10" }, now);
    assert.equal(r.from, "2026-09-10");
    assert.equal(r.to, "2026-09-20");
  });
});

describe("previousRange", () => {
  it("mirrors duration", () => {
    const r = previousRange({ from: "2026-09-01", to: "2026-09-30" });
    assert.equal(r.from, "2026-08-02");
    assert.equal(r.to, "2026-08-31");
  });
});
