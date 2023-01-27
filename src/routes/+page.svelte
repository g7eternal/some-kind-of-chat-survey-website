<script>
  import { browser } from "$app/environment";
  import { fade } from 'svelte/transition';
  import { Spinner } from "sveltestrap";

  import { initialize as initTMI } from "$lib/utils/chat.js";
  import { doTokenValidation as initTwitch } from "$lib/utils/twitch.js";

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

  // initialize twitch chain:
  if (browser) {
    initTMI().then(initTwitch);
  }

  $: {
    if (currentBlock) activeComponent = componentMap[currentBlock];
    if (!activeComponent) throw new Error("Invalid component specified: " + currentBlock);
  }

  // hack: load something heavy, and check how much time this will take
  let preloadEnded = false;
  if (browser) {
    const img = new Image();
    img.src = "./img/donkchat.gif";
    img.onload = () => preloadEnded = true;
  } else preloadEnded = true;
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

  {#if preloadEnded}

  <div class="flex-grow-1 d-flex flex-row overflow-hidden">
    {#key activeComponent}
      <div class="main" in:fade={{duration:200, delay:0}}>
        <svelte:component this={activeComponent} />
      </div>
    {/key}
    <SideBar bind:currentBlock />
  </div>
  
  {:else}

  <div class="w-100 h-100 d-flex">
    <Spinner size="lg" color="secondary" type="border" class="m-auto" style="width: 4em; height: 4em;" />
  </div>

  {/if}
</div>
