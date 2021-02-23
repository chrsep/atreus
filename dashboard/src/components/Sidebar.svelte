<script>
  import Button from "./Button.svelte"
  // import { getTargets } from "../api/targets"

  // let targets = getTargets()
</script>

<div class="sticky top-0 m-3 sidebar">
  <h2 class="text-center font-bold mb-3 tracking-widest">
    TARGETS
  </h2>

  <!--{#await targets}-->
  <!--{:then data}-->
  <!--  {data}-->
  <!--{:catch error}-->
  <!--  {error}-->
  <!--{/await}-->

  <a href="/targets/new">
    <Button class="w-full">
      New Target
    </Button>
  </a>
</div>

<style>
    .sidebar {
        width: 300px;
    }
</style>