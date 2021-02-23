<script lang="ts">
  export let label: string
  export let value: string

  let clazz: string
  export { clazz as class }
</script>


<label class={clazz}>
  {label}
  <input class="rounded p-2 w-full text-white dark:text-black border border-gray-400" bind:value on:keyup />
</label>

<style>
    label {
        @apply flex flex-col;
    }
</style>