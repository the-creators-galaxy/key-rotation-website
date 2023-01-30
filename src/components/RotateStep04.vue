<script setup lang="ts">
import AccountIdDisplay from "@/components/AccountIdDisplay.vue";
import HbarDisplay from "@/components/HbarDisplay.vue";
import { computed, onMounted, ref } from "vue";
import { model } from "@/models/rotation-input-context";
import { getTransactionReceipt } from "@/models/hashpool";
import { ResponseCodeEnum } from "@bugbytes/hapi-proto";
import { MirrorError } from "@bugbytes/hapi-mirror";
import {
  keyString_to_localeDateTimeString,
  timestamp_to_date,
  transactionID_to_keyString,
  type TimestampKeyString,
} from "@bugbytes/hapi-util";
import { getTransactionInfo } from "@/models/mirror";
import TransferDisplay from "./TransferDisplay.vue";
import { config } from "@/models/config";

const error = ref<string>();
const countdown = ref(0);

const hashscanUrl = computed(() => {
  return `${config.value.hashscanBaseUrl}/transaction/${model.value.transactionInfo?.consensus_timestamp}`;
});

onMounted(async () => {
  if (!model.value.accountInfo) {
    model.value.step = 1;
    return;
  }
  const transactionID = model.value.transactionID!;
  const txStarts = timestamp_to_date(transactionID.transactionValidStart!);
  countdown.value = Math.trunc(
    (txStarts.getTime() - new Date().getTime()) / 1000
  );
  checkExpires();
  try {
    model.value.receipt = await getTransactionReceipt(transactionID);
    model.value.transactionInfo = await getTransactionInfo(transactionID);
  } catch (err) {
    if (err instanceof MirrorError) {
      error.value = err.message;
    } else if (err instanceof Error) {
      error.value = err.message;
    } else {
      error.value = JSON.stringify(err);
    }
  }

  function checkExpires() {
    if (countdown.value > 0) {
      countdown.value = countdown.value - 1;
      setTimeout(checkExpires, 1000);
    }
  }
});

function onStartOver() {
  model.value = { step: 1 };
}
</script>

<template>
  <h2>
    Rotating Keys for Account
    <AccountIdDisplay v-bind:value="model.accountInfo!.accountId" />
  </h2>
  <p v-if="!!error">{{ error }}</p>
  <p v-else-if="countdown > 0">
    Submitting transaction in
    <span class="count">{{ countdown }} seconds</span> ...
  </p>
  <p v-else-if="!model.receipt">
    Submitted, waiting for hedera network to return a result ...
  </p>
  <template v-if="model.receipt">
    <dl>
      <dt>Transaction ID</dt>
      <dd v-if="model.transactionInfo">
        <a class="hashscan" v-bind:href="hashscanUrl" target="_blank">{{
          transactionID_to_keyString(model.transactionID)
        }}</a>
      </dd>
      <dd v-else>{{ transactionID_to_keyString(model.transactionID) }}</dd>
      <dt>Transaction Status:</dt>
      <dd>{{ ResponseCodeEnum[model.receipt.status] }}</dd>
      <template v-if="model.transactionInfo">
        <dt>Fee</dt>
        <dd>
          <HbarDisplay v-bind:value="model.transactionInfo.charged_tx_fee" />
        </dd>
        <dt>Consensus Timestamp</dt>
        <dd>
          {{
            keyString_to_localeDateTimeString(
              model.transactionInfo.consensus_timestamp as TimestampKeyString
            )
          }}
        </dd>
        <dt>Transaction Hash</dt>
        <dd>{{ model.transactionInfo.transaction_hash }}</dd>
        <dt>Transfers</dt>
        <dd
          v-for="xfer in model.transactionInfo.transfers"
          v-bind:key="xfer.account!"
        >
          <TransferDisplay v-bind:value="xfer" />
        </dd>
      </template>
      <template v-else>
        <dt>Details</dt>
        <dd>Retrieving ...</dd>
      </template>
    </dl>
  </template>
  <button v-if="!!error || model.transactionInfo" v-on:click="onStartOver">
    Start Over
  </button>
</template>

<style scoped>
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 16px;
  row-gap: 4px;
}

dt {
  grid-column: 1/2;
  margin: 0;
  color: var(--cds-nd-300);
}

dd {
  margin: 0;
  grid-column: 2/3;
  overflow: hidden;
  word-wrap: break-word;
  user-select: text;
}
span.count {
  color: var(--cds-cp-400);
}

a {
  cursor: pointer;
  color: var(--cds-cp-400);
  text-decoration: none;
}

a:hover {
  color: var(--cds-cs-500);
  text-decoration: underline;
}
</style>
