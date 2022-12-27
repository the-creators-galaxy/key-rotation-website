<script setup lang="ts">
import RotateStep01 from "./RotateStep01.vue";
import RotateStep02 from "./RotateStep02.vue";
import RotateStep03 from "./RotateStep03.vue";
import RotateStep04 from "./RotateStep04.vue";
import { model } from "@/models/rotation-input-context";
</script>

<template>
  <RotateStep01 v-if="model.step === 1" />
  <RotateStep02 v-else-if="model.step === 2" />
  <RotateStep03 v-else-if="model.step === 3" />
  <RotateStep04 v-else-if="model.step === 4" />
  <div v-else>Internal Error</div>
</template>

<style scoped>
header.main {
  min-height: 32px;
  text-align: right;
  padding: 24px clamp(20px, 19.72265vw - 73.959938px, 128px);
  background-image: url("@/assets/logo.svg");
  background-repeat: no-repeat;
  background-position: clamp(20px, 19.72265vw - 73.959938px, 128px) center;
  background-size: auto calc(100% - 40px);
  background-color: var(--cds-nd-800);
  border-bottom: 1px solid var(--cds-nd-600);
}

@media (max-width: 320px) {
  header.main {
    background-size: calc(100% - 7.35rem) auto;
  }
}
</style>
