import { describe, it, expect } from "vitest";
import {
  InvalidPdfError,
  EncryptedPdfError,
  OutOfMemoryError,
  CancelledError,
} from "../types";

describe("engine error types", () => {
  it("each error has the correct name", () => {
    expect(new InvalidPdfError("x").name).toBe("InvalidPdfError");
    expect(new EncryptedPdfError("x").name).toBe("EncryptedPdfError");
    expect(new OutOfMemoryError("x").name).toBe("OutOfMemoryError");
    expect(new CancelledError("x").name).toBe("CancelledError");
  });
  it("errors are instanceof Error", () => {
    expect(new InvalidPdfError("x")).toBeInstanceOf(Error);
  });
});
