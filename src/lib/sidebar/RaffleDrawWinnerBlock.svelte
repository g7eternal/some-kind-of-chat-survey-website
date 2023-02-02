<script>
  import { scale } from "svelte/transition";
  import { raffle } from "$lib/utils/raffle.js";
  import { tippy } from "../utils/tippy";
  import RaffleAnimation from "../elements/RaffleAnimation.svelte";
  import RaffleHistory from "../elements/RaffleHistory.svelte";

  export let mini = false;

  let startDrawing = false;

  function getWinner () {
    startDrawing = true;
  }

  function clearWinner () {
    $raffle.acknowledgeWinner();
    startDrawing = false;
  }
</script>

<style>
  button {
    font-size: inherit;
  }
  .animator {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 500;
    width: 100%;
    height: 100%;
    font-size: 1.5em;
    background: rgba(16, 16, 16, 0.69);
  }
</style>

<!--content-->
<button class="btn btn-primary w-100 text-start my-2"
  disabled={$raffle.entrants.size < 1}
  use:tippy={{placement: "left", content: "Starts the winner draft"}}
  on:click={getWinner}>
  <span class="material-icons">&#xea3f;</span>
  {#if !mini}
    {#if $raffle.winner}
      Draw another winner
    {:else}
      Draw a winner
    {/if}
  {/if}
</button>

<RaffleHistory {mini} />

<!-- celebratory block -->
{#if startDrawing}
<div class="animator" transition:scale={{duration:200}}>
  <RaffleAnimation on:drawn={clearWinner} />
</div>
{/if}