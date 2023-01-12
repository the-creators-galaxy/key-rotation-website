import {
  AccountID,
  CryptoUpdateTransactionBody,
  SignatureMap,
  SignaturePair,
  SignedTransaction,
  TransactionBody,
  TransactionID,
  TransactionReceipt,
  type Key,
} from "@bugbytes/hapi-proto";
import { createMempoolClient, selectRandomGossipNode } from "./config";

export interface RotateKeyParams {
  accountId: AccountID;
  newEndorsment: Key;
  startDelay: number;
}

export function createKeyRotationTransaction(
  createParams: RotateKeyParams
): Uint8Array {  
  const transactionID = TransactionID.fromPartial({
    accountID: createParams.accountId,
    transactionValidStart: createTimestampFromNow(createParams.startDelay || 0),
  });
  return TransactionBody.encode(
    TransactionBody.fromPartial({
      data: {
        $case: "cryptoUpdateAccount",
        cryptoUpdateAccount: CryptoUpdateTransactionBody.fromPartial({
          accountIDToUpdate: createParams.accountId,
          key: createParams.newEndorsment,
        }),
      },
      transactionFee: 5_00_000_000,
      nodeAccountID: selectRandomGossipNode(),
      transactionValidDuration: { seconds: 180 },
      memo: "",
      transactionID,
    })
  ).finish();
}

export async function submitTransaction(
  bodyBytes: Uint8Array,
  sigPair: SignaturePair[]
): Promise<void> {
  const transactionID = TransactionBody.decode(bodyBytes).transactionID;
  if (!transactionID) {
    throw new Error("Invalid Transaction");
  }
  const signedTransactionBytes = SignedTransaction.encode({
    bodyBytes,
    sigMap: SignatureMap.fromPartial({ sigPair }),
  }).finish();
  const client = createMempoolClient();
  await client.submitTransaction(signedTransactionBytes);
}

export async function getTransactionReceipt(
  transactionID: TransactionID
): Promise<TransactionReceipt> {
  const now = new Date();
  const startTime = new Date(
    transactionID.transactionValidStart!.seconds * 1000 +
      transactionID.transactionValidStart!.nanos / 1000000.0
  );
  const delay = startTime.getTime() - now.getTime() + 5000; // (add 5s margin)
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  const client = createMempoolClient();
  return await client.getTransactionReceipt(transactionID);
}

export function createTimestampFromNow(delayInSeconds: number) {
  const miliseconds = Date.now() + delayInSeconds * 1000;
  const seconds = ~~(miliseconds / 1_000);
  const nanos = (miliseconds % 1000) * 1_000_000;
  return { seconds, nanos };
}
