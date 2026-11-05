import { describe, expect, it } from "vitest";
import { copyText } from "./clipboard";

describe("copyText", () => {
  it("reports « copied » only after the clipboard accepted the text", async () => {
    let written = "";
    expect(await copyText("x", { writeText: async (t) => void (written = t) })).toBe("copied");
    expect(written).toBe("x");
  });

  it("reports a refusal as a failure, never as a success", async () => {
    const refused = { writeText: () => Promise.reject(new DOMException("denied", "NotAllowedError")) };
    expect(await copyText("x", refused)).toBe("failed");
  });

  it("reports a missing Clipboard API", async () => {
    expect(await copyText("x", null)).toBe("unavailable");
    expect(await copyText("x", {} as never)).toBe("unavailable");
  });
});
