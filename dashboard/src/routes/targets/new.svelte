<script lang="ts">
  import Input from "../../components/Input.svelte"
  import Button from "../../components/Button.svelte"
  import Card from "../../components/Card.svelte"
  import { postTargets } from "../../api/targets"

  let scopes: string[] = []
  let newScope = ""
  let name = ""

  function handleAddScope() {
    scopes = [...scopes, newScope]
    newScope = ""
  }

  function removeScope(index: number) {
    scopes.splice(index, 1)
    scopes = scopes
  }

  function handleEnter(e: KeyboardEvent) {
    if (e.code === "Enter") handleAddScope()
  }

  async function handleSubmit() {
    const result = await postTargets({ name, scopes })
    console.log(result)
  }
</script>

<div class="p-3 flex flex-col">
  <Input label="Name" class="my-3 w-full" bind:value={name} />


  <Card class="px-3 mb-3">
    <div class="pt-3 font-bold">Scopes</div>

    {#each scopes as scope, i}
      <div class="flex my-3 items-center">
        <Button class="bg-red-800" on:click={() => removeScope(i)}>Delete
        </Button>
        <span class="ml-3">{scope}</span>
      </div>
    {/each}

    <div class="flex items-end my-3 pt-3">
      <Input label="Pattern" class="w-full" bind:value={newScope} on:keyup={handleEnter} />

      <Button class="ml-3 flex-shrink-0" on:click={handleAddScope}>
        Add pattern
      </Button>
    </div>
  </Card>


  <Button class="ml-auto mt-6" on:click={handleSubmit}>
    Save
  </Button>
</div>
