<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  value: number | undefined;
}>();
const hbar = computed(() => {
  return ((props.value || 0) / 100_000_000).toFixed(8);
});
</script>

<template>{{ hbar }}ℏ</template>

<style scoped></style>
