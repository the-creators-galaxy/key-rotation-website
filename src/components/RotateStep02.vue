<script setup lang="ts">
import EndorsementDisplay from "@/components/EndorsementDisplay.vue";
import EndorsementEdit from "@/components/EndorsementEdit.vue";
import { model } from "@/models/rotation-input-context";
import { onMounted } from "vue";
import AccountIdDisplay from "./AccountIdDisplay.vue";

onMounted(() => {
  if (!model.value.accountInfo) {
    model.value.step = 1;
  }
});

async function onGoBack() {
  model.value.step = 1;
}

async function onContinue() {
  model.value.step = 3;
}
</script>
<template v-if="model.accountInfo?.accountId">
  <div>
    <h2>
      Account
      <AccountIdDisplay v-bind:value="model.accountInfo!.accountId" /> currently
      requires the following signatures:
    </h2>
    <EndorsementDisplay v-bind:value="model.accountInfo!.endorsements" />
    <h2>Please Edit the keys below to meet your <i>new</i> requirements:</h2>
    <EndorsementEdit v-bind:value="model.newEndorsements!" />
  </div>
  <div class="button-wrapper">
    <button v-on:click="onGoBack">Go Back</button>
    <button v-on:click="onContinue">Continue</button>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 24px;
}

div.button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  column-gap: 12px;
  margin-top: 20px;
}

i {
  color: var(--cds-cp-400);
}

div+h2 {
  margin-top: 24px;
}
</style>
