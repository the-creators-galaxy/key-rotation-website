<script setup lang="ts">
import * as ed from "@noble/ed25519";
import type { AccountID } from "@bugbytes/hapi-proto";
import { computed, defineProps } from "vue";
const props = defineProps<{
  value: AccountID;
}>();
const data = computed(() => {
  return props.value?.account || null;
});
</script>

<template>
  <span class="account-id">
    <template v-if="data?.$case === 'accountNum'">
      {{ value.shardNum }}.{{ value.realmNum }}.{{ data.accountNum }}
    </template>
    <template v-else-if="data?.$case === 'alias'">
      {{ value.shardNum }}.{{ value.realmNum }}.{{
        ed.utils.bytesToHex(data.alias)
      }}
    </template>
    <template v-else> Unknown Account ID </template>
  </span>
</template>

<style scoped></style>
