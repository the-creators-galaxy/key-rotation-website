import {
  is_entity_id,
  keyString_to_accountID,
  type EntityIdKeyString,
} from "@bugbytes/hapi-util";
import type { AccountInfo } from "./account-info";
import { createMirrorClient } from "./config";
import {
  MirrorError,
  mirrorString_to_publicKey,
  type TransactionInfo,
} from "@bugbytes/hapi-mirror";
import type { TransactionID } from "@bugbytes/hapi-proto";

export async function lookupAccountInfo(account: string): Promise<AccountInfo> {
  const client = createMirrorClient();
  if (is_entity_id(account)) {
    const info = await client.getAccountInfo(account);
    if (!info) {
      throw new Error("Account not found.");
    }
    const accountId = keyString_to_accountID(
      info.account as unknown as EntityIdKeyString
    );
    const endorsements = mirrorString_to_publicKey(info.key);
    return { accountId, endorsements };
  }
  throw new Error("Invalid Account ID");
}

export async function getTransactionInfo(
  transactionId: TransactionID
): Promise<TransactionInfo> {
  const client = createMirrorClient();
  // Retry up to a minute if necessary
  // (mirror node latency)
  for (let i = 0; i < 60; i++) {
    try {
      return await client.getTransaction(transactionId);
    } catch (err) {
      if (err instanceof MirrorError && err.status === 404) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }
      throw err;
    }
  }
  throw new MirrorError(
    "Unable to retrieve transaction information in a timely manner.",
    404
  );
}
