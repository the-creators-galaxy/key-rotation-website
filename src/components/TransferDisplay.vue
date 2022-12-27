<script setup lang="ts">
import HbarDisplay from "./HbarDisplay.vue";
import { defineProps } from "vue";
defineProps<{
  value: {
    account: string | null;
    amount: number;
    is_approval?: boolean | undefined;
  };
}>();
</script>

<template>
  <template v-if="value.amount < 0">
    <HbarDisplay v-bind:value="-value.amount" />
    from
  </template>
  <template v-else>
    <HbarDisplay v-bind:value="value.amount" />
    to
  </template>
  {{ value.account }}
  <span v-if="!!value.is_approval"> (as approval)</span>
</template>

<style scoped></style>
