import { describe, expect, test } from "bun:test";
import { parseDuration } from "./index";

describe("parseDuration", () => {
  test("converts hours and minutes to milliseconds", () => {
    expect(parseDuration("2h30m")).toBe(9_000_000);
  });

  test("converts seconds to milliseconds", () => {
    expect(parseDuration("45s")).toBe(45_000);
  });

  test("converts hours, minutes and seconds combined to milliseconds", () => {
    expect(parseDuration("1h20m15s")).toBe(4_815_000);
  });

  test("converts minutes and seconds to milliseconds", () => {
    expect(parseDuration("3m30s")).toBe(210_000);
  });

  test("throws a descriptive error for invalid input", () => {
    expect(() => parseDuration("not-a-duration")).toThrow(/invalid duration/i);
  });
});
