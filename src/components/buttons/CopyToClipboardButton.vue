<script setup lang="ts"></script>

<template>
  <button>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="white"
    >
      <path
        d="M4 11h2v6h-2v-6zm5-7h-5v5h2v-3h3v-2zm15 7h-2v6h2v-6zm-7-5v-2h-6v2h6zm2 0h3v3h2v-5h-5v2zm-2 18v-2h-6v2h6zm-8-2h-3v-3h-2v5h5v-2zm13-3v3h-3v2h5v-5h-2zm-1-19h-21v21h2v-19h19v-2z"
      />
    </svg>
  </button>
</template>

<style scoped>
button {
  display: grid;
  place-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  width: 44px;
  aspect-ratio: 1 / 1;
  padding: 0;
}

button:hover {
  background-color: var(--cds-nd-0-20);
  border-color: var(--cds-nd-0-20);
}

button:hover > svg {
  fill: var(--cds-cs-300);
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
