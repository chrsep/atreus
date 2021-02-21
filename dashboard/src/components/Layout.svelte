<script>
  import Sidebar from "./Sidebar.svelte"
  import Topbar from "./Topbar.svelte"

  let darkMode = true

  function handleToggleTheme() {
    darkMode = !darkMode
  }
</script>

<div class:dark={darkMode}>
  <div class="min-h-screen bg-white dark:bg-black color-black dark:text-white">

    <Topbar toggleTheme={handleToggleTheme} darkMode={darkMode}/>

    <div class="flex">
      <Sidebar />

      <main>
        <slot />
      </main>
    </div>
  </div>
</div>
