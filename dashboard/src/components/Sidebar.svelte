<script lang="ts">
  import Button from "./Button.svelte"
  import { getTargets } from "../api/targets"
</script>

<div class="sticky top-0 m-3 sidebar">
  <h2 class="text-center font-bold mb-3 tracking-widest">
    TARGETS
  </h2>

  {#await getTargets()}
    <p>loading</p>
  {:then targets}
    <div class="mb-3">
      {#each targets as target}
        <div class="py-2">
          {target.name}
        </div>
      {/each}
    </div>
  {:catch error}
    {error}
  {/await}

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