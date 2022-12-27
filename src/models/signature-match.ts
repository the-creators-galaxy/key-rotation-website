import type { Key, SignaturePair } from "@bugbytes/hapi-proto";
import { sequence_starts_with } from "@bugbytes/hapi-util";

export type KeyData = Key["key"];

export function hasSignatureMatch(
  keyData: KeyData,
  signatures: SignaturePair[]
): boolean {
  switch (keyData?.$case) {
    case "ed25519":
      {
        const lookup = keyData.ed25519;
        for (const check of signatures) {
          if (check.signature?.$case === "ed25519") {
            if (sequence_starts_with(lookup, check.pubKeyPrefix)) {
              return true;
            }
          }
        }
      }
      break;
    case "ECDSASecp256k1":
      {
        const lookup = keyData.ECDSASecp256k1;
        for (const check of signatures) {
          if (check.signature?.$case === "ECDSASecp256k1") {
            if (sequence_starts_with(lookup, check.pubKeyPrefix)) {
              return true;
            }
          }
        }
      }
      break;
    case "thresholdKey":
      {
        let count = 0;
        const requirement = keyData.thresholdKey.threshold;
        for (const child of keyData.thresholdKey.keys!.keys) {
          if (hasSignatureMatch(child.key, signatures)) {
            count = count + 1;
            if (count >= requirement) {
              return true;
            }
          }
        }
      }
      return false;
    case "keyList":
      for (const child of keyData.keyList.keys) {
        if (!hasSignatureMatch(child.key, signatures)) {
          return false;
        }
      }
      return true;
  }
  return false;
}
