<script setup lang="ts"></script>

<template>
  <button>
    <svg
      clip-rule="evenodd"
      fill-rule="evenodd"
      stroke-linejoin="round"
      stroke-miterlimit="2"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m22 7c0-.478-.379-1-1-1h-14c-.62 0-1 .519-1 1v14c0 .621.52 1 1 1h14c.478 0 1-.379 1-1zm-14.5.5h13v13h-13zm-5.5 7.5v2c0 .621.52 1 1 1h2v-1.5h-1.5v-1.5zm13.369-5s-2.136.002-4.616.003c-.414 0-.75.336-.75.75-.001 2.479-.003 4.612-.003 4.612 0 .41.335.745.75.745.414 0 .75-.334.75-.745v-2.804l4.439 4.439c.293.293.768.293 1.061 0s.293-.768 0-1.061l-4.439-4.439h2.808c.409 0 .741-.336.741-.75s-.333-.75-.741-.75zm-11.869.637v3.363h-1.5v-3.363zm0-4.637v3.637h-1.5v-3.637zm11.5-4v1.5h1.5v1.5h1.5v-2c0-.478-.379-1-1-1zm-10 0h-2c-.62 0-1 .519-1 1v2h1.5v-1.5h1.5zm4.5 1.5h-3.5v-1.5h3.5zm4.5 0h-3.5v-1.5h3.5z"
        fill-rule="nonzero"
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
