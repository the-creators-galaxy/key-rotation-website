<script setup lang="ts">
import EndorsementDisplay from "@/components/EndorsementDisplay.vue";
import { lookupAccountInfo } from "@/models/mirror";
import { model } from "@/models/rotation-input-context";
import { MirrorError } from "@bugbytes/hapi-mirror";
import { Key } from "@bugbytes/hapi-proto";
import { is_entity_id } from "@bugbytes/hapi-util";
import { onMounted, ref, watch } from "vue";
import AccountIdDisplay from "./AccountIdDisplay.vue";
import CopyFromClipboardButton from "./buttons/CopyFromClipboardButton.vue";

const inputBox = ref<any>();

watch(
  () => model.value.account,
  (account) => {
    const thisAccount = account;
    setTimeout(async () => {
      if (thisAccount === model.value.account) {
        if (!thisAccount) {
          model.value.accountInfo = undefined;
          model.value.accountError = "Account is Required.";
        } else if (!is_entity_id(thisAccount)) {
          model.value.accountInfo = undefined;
          model.value.accountError = "Invalid Account ID.";
        } else {
          try {
            const info = await lookupAccountInfo(thisAccount);
            if (thisAccount === model.value.account) {
              model.value.accountInfo = info;
              model.value.accountError = undefined;
            }
          } catch (ex) {
            if (thisAccount === model.value.account) {
              model.value.accountInfo = undefined;
              if (ex instanceof MirrorError && ex.status === 404) {
                model.value.accountError = "Account not found at this address.";
              } else if (ex instanceof Error) {
                model.value.accountError =
                  "Unable to retrieve Account Info, " + ex.message;
              } else {
                model.value.accountError = "Unable to retrieve Account Info.";
              }
            }
          }
        }
      }
    }, 250);
  }
);

onMounted(() => {
  inputBox.value.focus();
});

async function onPaste() {
  model.value.account = await navigator.clipboard.readText();
}

async function onContinue() {
  if (!!model.value.accountInfo && !model.value.accountError) {
    // Make a copy of the current key requrements as
    // a starting point for the user interface
    const bytes = Key.encode(model.value.accountInfo.endorsements).finish();
    model.value.newEndorsements = Key.decode(bytes);
    model.value.step = 2;
  }
}
</script>
<template>
  <h1>Hedera Account Key Rotation Tool</h1>
  <p>
    This tool orchestrates updating multi-party multi-key signing requirements
    for an Hedera account such as a DAO or corporate treasury.
  </p>
  <p>Please Identify the Account to Update:</p>
  <p class="input-wrapper">
    <input
      placeholder="Hedera Account (x.x.x)"
      v-model.trim="model.account"
      ref="inputBox"
    />
    <CopyFromClipboardButton v-on:click="onPaste" />
  </p>
  <div class="error" v-if="!!model.accountError">{{ model.accountError }}</div>
  <template v-if="!!model.accountInfo">
    <p>
      Account
      <AccountIdDisplay v-bind:value="model.accountInfo.accountId" />
      currently requires the following signatures:
    </p>
    <EndorsementDisplay v-bind:value="model.accountInfo.endorsements" />
    <div class="button-holder">
      <button v-on:click="onContinue">Continue</button>
    </div>
  </template>
</template>

<style scoped>
p.input-wrapper {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
}
div.button-holder {
  text-align: right;
}
div.error {
  color: var(--cds-ui-e-500);
}
</style>
