import { afterEach, describe, expect, it } from "vitest";
import { maxToolCallsPerTurn } from "./pi-runtime.js";

const original = process.env.MAX_TOOL_CALLS_PER_TURN;

afterEach(() => {
  if (original === undefined) delete process.env.MAX_TOOL_CALLS_PER_TURN;
  else process.env.MAX_TOOL_CALLS_PER_TURN = original;
});

describe("maxToolCallsPerTurn", () => {
  it("gives computer-enabled bots a larger default", () => {
    delete process.env.MAX_TOOL_CALLS_PER_TURN;
    expect(maxToolCallsPerTurn(false)).toBe(80);
    expect(maxToolCallsPerTurn(true)).toBe(400);
  });

  it("lets the environment override both defaults", () => {
    process.env.MAX_TOOL_CALLS_PER_TURN = "150";
    expect(maxToolCallsPerTurn(false)).toBe(150);
    expect(maxToolCallsPerTurn(true)).toBe(150);
  });

  it("ignores values that are not usable budgets", () => {
    for (const value of ["", "0", "-5", "abc"]) {
      process.env.MAX_TOOL_CALLS_PER_TURN = value;
      expect(maxToolCallsPerTurn(false)).toBe(80);
    }
  });

  it("floors fractional budgets", () => {
    process.env.MAX_TOOL_CALLS_PER_TURN = "12.9";
    expect(maxToolCallsPerTurn(false)).toBe(12);
  });
});
