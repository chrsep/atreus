<script lang="ts">
  import Button from "./Button.svelte"

  export let toggleTheme: () => void
  export let darkMode: boolean
</script>

<div class="w-full dark:bg-white bg-black shadow border-b border-gray-900 flex items-center">
  <Button class="ml-auto font-bold my-1 mr-1" on:click={toggleTheme}>
    {#if darkMode}
      DARK
    {:else}
      LIGHT
    {/if}
  </Button>
</div>