<script>
  let klass
  export { klass as class }
</script>

<button on:click class="{klass} bg-black dark:bg-white text-white dark:text-black">
  <slot />
</button>

<style>
    button {
        @apply rounded-lg font-bold py-2 px-3 text-sm;
    }
</style>