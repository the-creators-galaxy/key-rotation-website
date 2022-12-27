<script setup lang="ts">
import * as ed from "@noble/ed25519";
import type { ContractID } from "@bugbytes/hapi-proto";
import { computed, defineProps } from "vue";
const props = defineProps<{
  value: ContractID;
}>();
const data = computed(() => {
  return props.value?.contract || null;
});
</script>

<template>
  <template v-if="data?.$case === 'contractNum'">
    {{ value.shardNum }}.{{ value.realmNum }}.{{ data.contractNum }}
  </template>
  <template v-else-if="data?.$case === 'evmAddress'">
    {{ value.shardNum }}.{{ value.realmNum }}.{{
      ed.utils.bytesToHex(data.evmAddress)
    }}
  </template>
  <template v-else> Unknown Contract ID </template>
</template>

<style scoped></style>
