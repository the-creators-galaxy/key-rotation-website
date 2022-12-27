import type { TransactionInfo } from "@bugbytes/hapi-mirror";
import type {
  Key,
  TransactionID,
  TransactionReceipt,
} from "@bugbytes/hapi-proto";
import { ref } from "vue";
import type { AccountInfo } from "./account-info";

export interface RotationInputContext {
  step: number;
  account: string;
  accountInfo: AccountInfo;
  accountError: string;
  newEndorsements: Key;
  transactionID: TransactionID;
  receipt: TransactionReceipt;
  transactionInfo: TransactionInfo;
}

export const model = ref<Partial<RotationInputContext>>({ step: 1 });
