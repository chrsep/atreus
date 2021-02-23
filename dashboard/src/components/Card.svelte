<script lang="ts">
  let clazz: string
  export { clazz as class }
</script>

<div class="card {clazz}">
  <slot />
</div>

<style>
    .card {
        @apply bg-gray-200 text-black rounded;
    }
</style>