import { checkStealthAddress, computeStealthKey, generateStealthAddress, type GenerateStealthAddressReturnType } from "@scopelift/stealth-address-sdk/dist/utils/crypto/index.js";
import { generateRandomStealthMetaAddress } from "@scopelift/stealth-address-sdk/dist/utils/helpers/index.js";
import { VALID_SCHEME_ID } from "@scopelift/stealth-address-sdk/dist/utils/crypto/types/index.js";
import { privateKeyToAccount } from "viem/accounts";

export const SCHEME_ID = VALID_SCHEME_ID.SCHEME_ID_1;

export type RecipientKeys = ReturnType<typeof generateRandomStealthMetaAddress>;

export function createRecipientKeys(): RecipientKeys {
  return generateRandomStealthMetaAddress();
}

export function deriveStealthDestination(stealthMetaAddressURI: string): GenerateStealthAddressReturnType {
  return generateStealthAddress({ stealthMetaAddressURI, schemeId: SCHEME_ID });
}

export function recoverStealthAddress(keys: RecipientKeys, announcement: Pick<GenerateStealthAddressReturnType, "stealthAddress" | "ephemeralPublicKey" | "viewTag">) {
  const stealthPrivateKey = computeStealthKey({
    viewingPrivateKey: keys.viewingPrivateKey,
    spendingPrivateKey: keys.spendingPrivateKey,
    ephemeralPublicKey: announcement.ephemeralPublicKey,
    schemeId: SCHEME_ID
  });
  const account = privateKeyToAccount(stealthPrivateKey);
  const matches = checkStealthAddress({
    userStealthAddress: announcement.stealthAddress,
    viewTag: announcement.viewTag,
    ephemeralPublicKey: announcement.ephemeralPublicKey,
    spendingPublicKey: keys.spendingPublicKey,
    viewingPrivateKey: keys.viewingPrivateKey,
    schemeId: SCHEME_ID
  });
  if (!matches || account.address.toLowerCase() !== announcement.stealthAddress.toLowerCase()) {
    throw new Error("STEALTH_OWNERSHIP_CHECK_FAILED");
  }
  return { stealthPrivateKey, stealthAddress: account.address };
}
