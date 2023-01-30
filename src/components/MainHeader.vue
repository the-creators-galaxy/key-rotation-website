<script setup lang="ts">
import { config } from "@/models/config";
</script>

<template>
  <header class="main">
    <span
      v-if="'mainnet' === config.network"
      class="main"
      :title="config.hashpoolEndpoint"
      >Main Network</span
    >
    <span
      v-else-if="!config.network"
      class="main"
      title="Locating Network Info ..."
      >...</span
    >
    <span v-else class="other" :title="config.hashpoolEndpoint">{{
      config.network
    }}</span>
  </header>
</template>

<style scoped>
header.main {
  min-height: 32px;
  text-align: right;
  padding: 24px max(20px, 50% - 400px);
  background-image: url("@/assets/logo.svg");
  background-repeat: no-repeat;
  background-position: max(20px, 50% - 298px) center;
  background-size: auto calc(100% - 40px);
  background-color: var(--cds-nd-800);
  border-bottom: 1px solid var(--cds-nd-600);
}

span.main {
  color: var(--cds-cp-500);
  font-weight: bold;
}

span.other {
  color: black;
  background-color: var(--cds-ui-e-600);
  font-weight: bold;
  padding: 3px 6px;
  border-radius: 3px;
  text-transform: uppercase;
}

@media (max-width: 320px) {
  header.main {
    background-size: calc(100% - 7.35rem) auto;
  }
}
</style>
