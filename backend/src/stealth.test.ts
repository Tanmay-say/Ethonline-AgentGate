import { describe, expect, it } from "vitest";
import { createRecipientKeys, deriveStealthDestination, recoverStealthAddress } from "./stealth.js";

describe("ERC-5564 scheme 1 local round trip", () => {
  it("derives a fresh destination and recovers the matching private key locally", () => {
    const keys = createRecipientKeys();
    const first = deriveStealthDestination(keys.stealthMetaAddressURI);
    const second = deriveStealthDestination(keys.stealthMetaAddressURI);
    expect(first.stealthAddress).not.toBe(second.stealthAddress);
    const recovered = recoverStealthAddress(keys, first);
    expect(recovered.stealthAddress.toLowerCase()).toBe(first.stealthAddress.toLowerCase());
  });
});
