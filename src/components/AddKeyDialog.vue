<script setup lang="ts">
import type { Key } from "@bugbytes/hapi-proto";
import { keyString_to_publicKey } from "@bugbytes/hapi-util";
import { computed, onMounted, ref, watch } from "vue";
import CopyFromClipboardButton from "./buttons/CopyFromClipboardButton.vue";

interface InputPublicKeyModel {
  publicKeyAsString: string;
  publicKey: Key;
  error: string;
  visited: boolean;
}

let resolveFn: ((result: Key | null) => void) | null = null;

const dialog = ref<any>();
const model = ref<Partial<InputPublicKeyModel>>({});
const keyData = computed(() => {
  return model.value?.publicKey?.key || null;
});

onMounted(() => {
  dialog.value.addEventListener("cancel", onCancel);
});

watch(
  () => model.value.publicKeyAsString,
  (publicKeyAsString) => {
    const thisPublicKeyAsString = publicKeyAsString;
    setTimeout(async () => {
      if (thisPublicKeyAsString === model.value.publicKeyAsString) {
        if (!thisPublicKeyAsString) {
          if (model.value.visited) {
            model.value.publicKey = undefined;
            model.value.error = "Public Key is Required.";
          }
        } else {
          try {
            const key = keyString_to_publicKey(thisPublicKeyAsString);
            if (
              key.key?.$case === "keyList" ||
              key.key?.$case === "thresholdKey"
            ) {
              model.value.publicKey = undefined;
              model.value.error = "Only single key types can be input here.";
            } else {
              model.value.publicKey = key;
              model.value.error = undefined;
            }
          } catch (ex: any) {
            model.value.publicKey = undefined;
            model.value.error = ex.message;
          }
        }
      }
    }, 250);
  }
);

function promptUserForPublicKey(): Promise<Key | null> {
  model.value = {};
  return new Promise((resolve, reject) => {
    if (dialog.value.open) {
      reject("Dialog is Already Open");
    } else {
      resolveFn = resolve;
      dialog.value.showModal();
    }
  });
}

function onConfirm() {
  if (model.value.publicKey && dialog.value.open) {
    dialog.value.close();
    if (resolveFn) {
      resolveFn(model.value.publicKey);
      resolveFn = null;
      model.value = {};
    }
  }
}

async function onPaste() {
  model.value.publicKeyAsString = await navigator.clipboard.readText();
}

function onCancel() {
  if (dialog.value.open) {
    dialog.value.close();
    if (resolveFn) {
      resolveFn(null);
      resolveFn = null;
    }
  }
}

function onBlur() {
  model.value.visited = true;
}

defineExpose({
  promptUserForPublicKey,
});
</script>

<template>
  <dialog ref="dialog">
    <header>
      <h1>Add Public Key</h1>
      <button v-on:click="onCancel" class="close"></button>
    </header>
    <div>
      <div class="input-key">
        <input
          type="text"
          v-model.trim="model.publicKeyAsString"
          v-on:blur="onBlur"
          placeholder="E.g. 302a300506032b6570032100&mldr;"
        />
        <CopyFromClipboardButton v-on:click="onPaste" />
      </div>
      <div v-if="model.error" class="message error">{{ model.error }}</div>
      <div v-else-if="keyData" class="message">
        Recognized as <span class="key-type">{{ keyData.$case }}</span> Key
      </div>
      <div v-else class="message">
        Please enter an ED25519 or ECDSA private key.
      </div>
    </div>
    <footer>
      <button v-on:click="onCancel">Cancel</button>
      <button v-on:click="onConfirm" v-bind:disabled="!keyData">
        Add {{ keyData ? keyData.$case : "" }} Key
      </button>
    </footer>
  </dialog>
</template>

<style scoped>
dialog > div {
  display: grid;
  grid-template-rows: max-content 1fr;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 1rem 3em;
}
div.input-key {
  display: grid;
  grid-template-columns: 1fr max-content;
  column-gap: 0.375rem;
}
div.message {
  margin: 1rem 0;
  overflow: hidden;
  overflow-wrap: break-word;
}
div.error {
  color: var(--cds-ct-500);
}
span.key-type {
  font-style: italic;
  color: var(--cds-cs-600);
}
</style>
