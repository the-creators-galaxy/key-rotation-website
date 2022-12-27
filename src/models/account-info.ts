import type { AccountID, Key } from "@bugbytes/hapi-proto";

export interface AccountInfo {
  accountId: AccountID;
  endorsements: Key;
}
