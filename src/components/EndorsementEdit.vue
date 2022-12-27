<script setup lang="ts">
import ContractIdDisplay from "@/components/ContractIdDisplay.vue";
import AddKeyDialog from "@/components/AddKeyDialog.vue";
import RemoveButton from "@/components/buttons/RemoveButton.vue";
import AddButton from "@/components/buttons/AddButton.vue";
import ToListButton from "@/components/buttons/ToListButton.vue";
import ToKeyButton from "@/components/buttons/ToKeyButton.vue";
import * as ed from "@noble/ed25519";
import { Key } from "@bugbytes/hapi-proto";
import { computed, defineProps, ref } from "vue";

const props = defineProps<{
  value: Key;
}>();
const addKeyDialog = ref<any>();
const data = computed(() => {
  return props.value?.key || null;
});
const listOptions = computed(() => {
  let length = 0;
  if (data.value?.$case === "thresholdKey") {
    length = data.value?.thresholdKey.keys?.keys.length || 0;
  } else if (data.value?.$case === "keyList") {
    length = data.value.keyList.keys.length;
  }
  const list = [];
  for (let i = 0; i < length; i++) {
    list.push(`Threshold ${i + 1} of ${length}`);
  }
  list.push("All Keys in List");
  return list;
});
const selectedListItem = computed({
  get() {
    if (data.value?.$case === "thresholdKey") {
      return data.value.thresholdKey.threshold - 1;
    } else if (data.value?.$case === "keyList") {
      return data.value.keyList.keys.length;
    }
    return 0;
  },
  set(newValue) {
    if (data.value?.$case === "thresholdKey") {
      if (newValue < (data.value.thresholdKey.keys?.keys.length || 0)) {
        data.value.thresholdKey.threshold = newValue + 1;
      } else {
        const keys = data.value.thresholdKey.keys!.keys;
        props.value.key = {
          $case: "keyList",
          keyList: { keys },
        };
      }
    } else if (data.value?.$case === "keyList") {
      if (newValue < data.value.keyList.keys.length) {
        const keys = data.value.keyList.keys;
        props.value.key = {
          $case: "thresholdKey",
          thresholdKey: {
            threshold: newValue + 1,
            keys: { keys },
          },
        };
      } else {
        // noop
      }
    }
  },
});

async function addKey() {
  const key = await addKeyDialog.value.promptUserForPublicKey();
  if (key) {
    if (props.value.key?.$case === "thresholdKey") {
      props.value.key.thresholdKey.keys?.keys.push(key);
    } else if (props.value.key?.$case === "keyList") {
      props.value.key.keyList.keys.push(key);
    }
  }
}

async function removeKey(index: number) {
  if (props.value.key?.$case === "thresholdKey") {
    props.value.key.thresholdKey.keys?.keys.splice(index, 1);
    const len = props.value.key.thresholdKey.keys?.keys.length || 0;
    if (props.value.key.thresholdKey.threshold >= len) {
      props.value.key.thresholdKey.threshold = len;
    }
  } else if (props.value.key?.$case === "keyList") {
    props.value.key.keyList.keys.splice(index, 1);
  }
}

function onConvertToThreshold() {
  if (props.value.key) {
    const copy = Key.decode(Key.encode(props.value).finish());
    props.value.key = {
      $case: "thresholdKey",
      thresholdKey: {
        threshold: 1,
        keys: { keys: [copy] },
      },
    };
  }
}

function onConvertSingleKey() {
  if (props.value.key?.$case === "thresholdKey") {
    props.value.key = props.value.key.thresholdKey.keys?.keys[0].key;
  } else if (props.value.key?.$case === "keyList") {
    props.value.key = props.value.key.keyList.keys[0].key;
  }
}
</script>

<template>
  <div class="key-info" v-if="data?.$case === 'contractID'">
    <div class="key-type">Contract</div>
    <div class="key-data">
      <ContractIdDisplay v-bind:value="data.contractID" />
    </div>
    <ToListButton v-on:click="onConvertToThreshold" />
  </div>
  <div class="key-info" v-else-if="data?.$case === 'ed25519'">
    <div class="key-type">Ed25519</div>
    <div class="key-data">{{ ed.utils.bytesToHex(data.ed25519) }}</div>
    <ToListButton v-on:click="onConvertToThreshold" />
  </div>
  <div class="key-info" v-else-if="data?.$case === 'rsa3072'">
    <div class="key-type">RSA 3072</div>
    <div class="key-data">{{ ed.utils.bytesToHex(data.rsa3072) }}</div>
    <ToListButton v-on:click="onConvertToThreshold" />
  </div>
  <div class="key-info" v-else-if="data?.$case === 'ecdsa384'">
    <div class="key-type">ECDSA 384</div>
    <div class="key-data">{{ ed.utils.bytesToHex(data.ecdsa384) }}</div>
    <ToListButton v-on:click="onConvertToThreshold" />
  </div>
  <div class="key-list" v-else-if="data?.$case === 'thresholdKey'">
    <div class="key-list-header">
      <select v-model="selectedListItem">
        <option
          v-for="(option, index) in listOptions"
          :value="index"
          v-bind:key="index"
        >
          {{ option }}
        </option>
      </select>
      <ToKeyButton
        v-if="data.thresholdKey.keys?.keys.length === 1"
        v-on:click="onConvertSingleKey"
      />
      <AddButton v-on:click="addKey" />
    </div>
    <div
      class="key-list-item"
      v-for="(subKey, index) in data.thresholdKey.keys?.keys"
      v-bind:key="index"
    >
      <EndorsementEdit v-bind:value="subKey" />
      <RemoveButton
        v-if="(data.thresholdKey.keys?.keys.length || 0) > 1"
        v-on:click="removeKey(index)"
      />
    </div>
  </div>
  <div class="key-list" v-else-if="data?.$case === 'keyList'">
    <div class="key-list-header">
      <select v-model="selectedListItem">
        <option
          v-for="(option, index) in listOptions"
          :value="index"
          v-bind:key="index"
        >
          {{ option }}
        </option>
      </select>
      <ToKeyButton
        v-if="data.keyList.keys.length === 1"
        v-on:click="onConvertSingleKey"
      />
      <AddButton v-on:click="addKey" />
    </div>
    <div
      class="key-list-item"
      v-for="(subKey, index) in data.keyList.keys"
      v-bind:key="index"
    >
      <EndorsementEdit v-bind:value="subKey" />
      <RemoveButton
        v-if="data.keyList.keys.length > 1"
        v-on:click="removeKey(index)"
      />
    </div>
  </div>
  <div class="key-info" v-else-if="data?.$case === 'ECDSASecp256k1'">
    <div class="key-type">ECDSA Secp256k1</div>
    <div class="key-data">{{ ed.utils.bytesToHex(data.ECDSASecp256k1) }}</div>
    <button v-on:click="onConvertToThreshold">=</button>
  </div>
  <div class="key-info" v-else-if="data?.$case === 'delegatableContractId'">
    <div class="key-type">Delegate Contract</div>
    <div class="key-data">
      <ContractIdDisplay v-bind:value="data.delegatableContractId" />
    </div>
    <ToListButton v-on:click="onConvertToThreshold" />
  </div>
  <div class="key-info" v-else>
    <div class="key-type">Unknown</div>
    <div class="key-data">Invalid Data</div>
  </div>
  <AddKeyDialog ref="addKeyDialog" />
</template>

<style scoped>
div.key-info {
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  align-items: center;
}
div.key-type {
  font-size: 10px;
  margin-right: 12px;
  color: var(--cds-cs-500);
}
div.key-data {
  overflow: hidden;
  text-overflow: ellipsis;
}
div.key-list-header {
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  align-items: center;
}
div.key-list-item {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: top;
  margin-left: 3px;
  padding-left: 12px;
  border-left: 3px solid var(--cds-ui-s-500);
}
div.key-list-item > button {
  margin-top: 4px;
}
button {
  margin-left: 4px;
}
select {
  justify-self: start;
}
</style>
