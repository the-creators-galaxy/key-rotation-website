<script setup lang="ts"></script>

<template>
  <button>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 12H7.5M12 7.5V16.5"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </button>
</template>

<style scoped>
button {
  display: grid;
  place-items: center;
  background: var(--cds-ui-s-700);
  border: 1px solid var(--cds-ui-s-700);
  border-radius: 50%;
  width: 32px;
  aspect-ratio: 1 / 1;
  padding: 0;
}

button:hover {
  background-color: var(--cds-ui-s-500);
  border-color: var(--cds-ui-s-700);
}

button:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--cds-nd-600), inset 0 0 0 1px var(--cds-nl-500);
}

button:active {
  box-shadow: 0 0 0 2px var(--cds-nd-600), inset 0 0 0 2px var(--cds-nl-500);
}

button:disabled {
  opacity: 0.5;
  background-color: var(--cds-nd-500);
  border-color: transparent;
  box-shadow: none;
}
</style>
