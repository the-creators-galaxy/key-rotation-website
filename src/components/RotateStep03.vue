<script setup lang="ts">
import * as ed from "@noble/ed25519";
import { computed, onMounted, ref } from "vue";
import EndorsementTrack from "@/components/EndorsementTrack.vue";
import {
  createKeyRotationTransaction,
  submitTransaction,
} from "@/models/hashpool";
import { model } from "@/models/rotation-input-context";
import AccountIdDisplay from "./AccountIdDisplay.vue";
import {
  SignatureMap,
  SignaturePair,
  SignedTransaction,
  Timestamp,
  Transaction,
  TransactionBody,
} from "@bugbytes/hapi-proto";
import { hasSignatureMatch } from "@/models/signature-match";
import { sequences_are_equal } from "@bugbytes/hapi-util";

const expires = ref<Date>();
const starts = ref<Date>();
const countdown = ref(0);
const transaction = ref<Uint8Array>();
const hashConnectBytes = ref<Uint8Array>();
const signatures = ref<SignaturePair[]>([]);
const error = ref<string>();

const isSatisfied = computed(() => {
  return (
    hasSignatureMatch(
      model.value.accountInfo!.endorsements.key,
      signatures.value
    ) && hasSignatureMatch(model.value.newEndorsements!.key, signatures.value)
  );
});

onMounted(() => {
  if (!model.value.accountInfo) {
    model.value.step = 1;
    return;
  }
  transaction.value = createKeyRotationTransaction({
    accountId: model.value.accountInfo!.accountId,
    newEndorsment: model.value.newEndorsements!,
    startDelay: 30,
  });
  hashConnectBytes.value = Transaction.encode(
    Transaction.fromPartial({
      signedTransactionBytes: SignedTransaction.encode({
        bodyBytes: transaction.value,
        sigMap: SignatureMap.fromPartial({}),
      }).finish(),
    })
  ).finish();
  const transactionBody = TransactionBody.decode(transaction.value);
  const transactionID = transactionBody.transactionID!;
  model.value.transactionID = transactionID;
  starts.value = dateFromTimestamp(transactionID.transactionValidStart!);
  expires.value = dateFromTimestamp(
    transactionID.transactionValidStart!,
    transactionBody.transactionValidDuration?.seconds
  );
  checkExpires();
});

function checkExpires() {
  const left = Math.trunc(
    (expires.value!.getTime() - new Date().getTime()) / 1000
  );
  if (left > 0) {
    countdown.value = left - 0;
    setTimeout(checkExpires, 1000);
  } else {
    error.value = "Transaction Has Expired.";
    countdown.value = 0;
  }
}

function dateFromTimestamp(timestamp: Timestamp, offset: number = 0) {
  return new Date(
    (timestamp.seconds + offset) * 1000 + timestamp.nanos / 1000000.0
  );
}

async function copyTransaction() {
  await navigator.clipboard.writeText(ed.utils.bytesToHex(transaction.value!));
}

async function pasteSignature() {
  try {
    const text = await navigator.clipboard.readText();
    const bytes = ed.utils.hexToBytes(text);
    const sigMap = SignatureMap.decode(bytes);
    for (const sigPair of sigMap.sigPair) {
      let dupFound = false;
      for (const existingPair of signatures.value) {
        if (
          sequences_are_equal(sigPair.pubKeyPrefix, existingPair.pubKeyPrefix)
        ) {
          dupFound = true;
          error.value = "Can't add duplicate signatures.";
          break;
        }
      }
      if (!dupFound) {
        signatures.value.push(sigPair);
      }
    }
  } catch (err) {
    error.value = "Error Retrieving signature from Clipboard.";
    console.error(err);
  }
}

async function onGoBack() {
  model.value.step = 2;
}

async function onSubmit() {
  try {
    error.value = "";
    await submitTransaction(transaction.value!, signatures.value);
    model.value.step = 4;
  } catch (err: any) {
    error.value = err.message;
  }
}
</script>
<template v-if="model.accountInfo?.accountId">
  <div>
    <h2>
      Sign Update Transaction for Account
      <AccountIdDisplay v-bind:value="model.accountInfo!.accountId" />
    </h2>
    <p>
      The update transaction is ready and waiting for signatures. Please
      orchestrate the distribution of this transaction to required parties and
      collect their signatures either thrugh copy and paste (via DMs for
      example) or via the HashConnect protocol.
    </p>
    <p v-if="countdown > 0">
      Waiting for Signatures, Transaction expires in
      <span class="count" v-bind:class="{ close: countdown < 30 }">{{
        countdown
      }}</span>
      seconds.
    </p>
    <p v-if="countdown === 0" class="error">Transaction Has Exired</p>
    <h3>Existing Key Requirements:</h3>
    <EndorsementTrack
      v-bind:value="model.accountInfo!.endorsements"
      v-bind:signatures="signatures"
    />
    <h3>New Key Requirements:</h3>
    <EndorsementTrack
      v-bind:value="model.newEndorsements!"
      v-bind:signatures="signatures"
    />
    <div class="commands-wrapper">
      <button v-on:click="copyTransaction">
        Copy Transaction to Clipboard
      </button>
      <button v-on:click="pasteSignature">Paste Signature</button>
    </div>
  </div>
  <p v-if="!error" class="countdown">
    Waiting for Signatures, Transaction expires in
    <span class="count" v-bind:class="{ close: countdown < 30 }">{{
      countdown
    }}</span>
    seconds.
  </p>
  <p v-if="!!error" class="error">{{ error }}</p>
  <div class="button-wrapper">
    <button v-on:click="onGoBack">Go Back</button>
    <button v-if="!error && isSatisfied" v-on:click="onSubmit">
      Send Transaction to Network
    </button>
  </div>
</template>

<style scoped>
div.commands-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  column-gap: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}

div.button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  column-gap: 12px;
  margin-top: 20px;
  text-align: right;
}

p.countdown {
  margin-top: 30px;
  text-align: right;
}

p.error {
  color: var(--cds-ui-e-500);
}

span.count {
  color: var(--cds-cp-400);
  font-weight: 700;
}

span.count.close {
  color: var(--cds-ct-500);
  font-weight: 700;
}
</style>
