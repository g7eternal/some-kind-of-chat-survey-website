<script>
  import { fade } from 'svelte/transition';

  import NavBar from "$lib/NavBar.svelte";
  import SideBar from "$lib/SideBar.svelte";

	import DefaultPoll from "$lib/content/DefaultPoll.svelte";
	import Raffle from "$lib/content/Raffle.svelte";
	import YesNoPoll from "$lib/content/YesNoPoll.svelte";

  const componentMap = {
    raffle: Raffle,
    yesno: YesNoPoll,
    default: DefaultPoll
  };

  let activeComponent = componentMap.default;
  let currentBlock = "default";

  $: {
    if (currentBlock) activeComponent = componentMap[currentBlock];
    if (!activeComponent) throw new Error("Invalid component specified: " + currentBlock);
  }
</script>

<style>
  .main {
    flex: 1 0 0;
    max-height: 100%;
    overflow: auto;
  }
</style>

<!-- content -->
<div class="d-flex flex-column h-100 mh-100">
  <NavBar />
  <div class="flex-grow-1 d-flex flex-row overflow-hidden">
    {#key activeComponent}
      <div class="main" in:fade={{duration:200, delay:0}}>
        <svelte:component this={activeComponent} />
      </div>
    {/key}
    <SideBar bind:currentBlock />
  </div>
</div>
