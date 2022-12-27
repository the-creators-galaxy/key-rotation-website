<script setup lang="ts">
import ContractIdDisplay from "@/components/ContractIdDisplay.vue";
import * as ed from "@noble/ed25519";
import type { Key, SignaturePair } from "@bugbytes/hapi-proto";
import { computed, defineProps } from "vue";
import { hasSignatureMatch } from "@/models/signature-match";

const props = defineProps<{
  value: Key;
  signatures: SignaturePair[];
}>();

const data = computed(() => {
  return props.value?.key || null;
});
const isSatisfied = computed(() => {
  switch (data.value?.$case) {
    case "ed25519":
    case "ECDSASecp256k1":
    case "thresholdKey":
    case "keyList":
      return hasSignatureMatch(data.value, props.signatures);
  }
  return false;
});
</script>

<template>
  <template v-if="data?.$case === 'contractID'">
    <div class="key-info" v-bind:class="{ satisfied: isSatisfied }">
      <div class="key-type">Contract</div>
      <div class="key-data">
        <ContractIdDisplay v-bind:value="data.contractID" />
      </div>
    </div>
  </template>
  <template v-else-if="data?.$case === 'ed25519'">
    <div class="key-info" v-bind:class="{ satisfied: isSatisfied }">
      <div class="key-type">Ed25519</div>
      <div class="key-data">{{ ed.utils.bytesToHex(data.ed25519) }}</div>
    </div>
  </template>
  <template v-else-if="data?.$case === 'rsa3072'">
    <div class="key-info" v-bind:class="{ satisfied: isSatisfied }">
      <div class="key-type">RSA 3072</div>
      <div class="key-data">{{ ed.utils.bytesToHex(data.rsa3072) }}</div>
    </div>
  </template>
  <template v-else-if="data?.$case === 'ecdsa384'">
    <div class="key-info" v-bind:class="{ satisfied: isSatisfied }">
      <div class="key-type">ECDSA 384</div>
      <div class="key-data">{{ ed.utils.bytesToHex(data.ecdsa384) }}</div>
    </div>
  </template>
  <template v-else-if="data?.$case === 'thresholdKey'">
    <div class="list-header" v-bind:class="{ satisfied: isSatisfied }">
      Threshold {{ data.thresholdKey.threshold }} of
      {{ data.thresholdKey.keys?.keys.length }}:
    </div>
    <div class="list-body">
      <div
        v-for="(subKey, index) in data.thresholdKey.keys?.keys"
        v-bind:key="index"
      >
        <EndorsementTrack
          v-bind:value="subKey"
          v-bind:signatures="props.signatures"
        />
      </div>
    </div>
  </template>
  <template v-else-if="data?.$case === 'keyList'">
    <div class="list-header" v-bind:class="{ satisfied: isSatisfied }">
      All in List of {{ data.keyList.keys.length }}:
    </div>
    <div class="list-body">
      <div v-for="(subKey, index) in data.keyList.keys" v-bind:key="index">
        <EndorsementTrack
          v-bind:value="subKey"
          v-bind:signatures="props.signatures"
        />
      </div>
    </div>
  </template>
  <template v-else-if="data?.$case === 'ECDSASecp256k1'">
    <div class="key-info" v-bind:class="{ satisfied: isSatisfied }">
      <div class="key-type">ECDSA Secp256k1</div>
      <div class="key-data">{{ ed.utils.bytesToHex(data.ECDSASecp256k1) }}</div>
    </div>
  </template>
  <template v-else-if="data?.$case === 'delegatableContractId'">
    <div class="key-info" v-bind:class="{ satisfied: isSatisfied }">
      <div class="key-type">Delegate Contract</div>
      <div class="key-data">
        <ContractIdDisplay v-bind:value="data.delegatableContractId" />
      </div>
    </div>
  </template>
  <template v-else> Unknown </template>
</template>

<style scoped>
div.key-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
  overflow: hidden;
}
div.list-header {
  color: var(--cds-cp-400);
}
div.key-info::before,
div.list-header::before {
  content: "?";
  color: var(--cds-ui-w-500);
  margin-right: 10px;
  min-width: 8px;
}
div.key-info.satisfied::before,
div.list-header.satisfied::before {
  content: "✓";
  color: var(--cds-ui-s-600);
  margin-right: 10px;
}
div.key-type {
  font-size: 10px;
  line-height: 10px;
  color: var(--cds-cs-500);
}
div.key-data {
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: text;
}
div.list-body {
  padding-left: 10px;
}
</style>
