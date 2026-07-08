import { describe, it, expect } from "vitest";
import { getInitials } from "./user";

describe("getInitials", () => {
  it("uses the first letter of a simple local-part", () => {
    expect(getInitials("jane@example.com")).toBe("J");
  });

  it("uses the first letter of each dot-separated segment", () => {
    expect(getInitials("jane.doe@example.com")).toBe("JD");
  });

  it("ignores a plus-addressed suffix", () => {
    expect(getInitials("jane+test@example.com")).toBe("J");
  });

  it("falls back to the digit when the local-part is numeric", () => {
    expect(getInitials("123@example.com")).toBe("1");
  });

  it("returns a safe fallback for an empty string", () => {
    expect(getInitials("")).toBe("?");
  });

  it("normalizes to uppercase regardless of input case", () => {
    expect(getInitials("JANE@EXAMPLE.COM")).toBe("J");
    expect(getInitials("jane.doe@example.com")).toBe(
      getInitials("JANE.DOE@EXAMPLE.COM"),
    );
  });

  it("handles a single-character local-part", () => {
    expect(getInitials("j@example.com")).toBe("J");
  });
});
