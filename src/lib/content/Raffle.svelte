<script>
  import { raffle } from "$lib/utils/raffle.js";
  import { settings } from "$lib/utils/stores.js";
  import RafflePrize from "../elements/RafflePrize.svelte";
  import RaffleUserPill from "../elements/RaffleUserPill.svelte";
  import RaffleWinner from "../elements/RaffleWinner.svelte";

  let entries = [];
  $: entries = Array.from($raffle.entries.values());
</script>

<div class="d-flex flex-column h-100 p-2">
  <RafflePrize />

  <div class="main-block">
    {#if $raffle.winner}
      <RaffleWinner />
    {:else}
      <h1 class="m-auto text-center position-relative">
        {#if $settings.raffleCommand && $raffle.allowVote}
          <img src="favicon.png" alt="Donk" width="90" height="90" class="me-3" />
          <img src="img/bell.png" alt="Bell" width="90" height="90" class="dinkdonk" />
          <br />
          <span class="text-success-emphasis">
            Type
            <strong class="text-success">
              {$settings.raffleCommand || "anything"}
            </strong>
            to enter the raffle
          </span>
        {:else if $raffle.entrants.size > 0}
          <img src="img/donkies.webp" alt="Hype!" width="90" height="90" />
          <br />
          Awaiting for a winner draw...
        {:else}
          <em>Raffle has not started yet</em>
        {/if}
      </h1>
    {/if}
  </div>
  <div class="fs-4">
    Entrants:
    <span class="text-primary-emphasis">
      {$raffle.entrants.size}
    </span>
  </div>
  <div class="entrant-list">
    {#each entries as entry}
      <RaffleUserPill {entry} />
    {/each}
  </div>
</div>

<style>
  .entrant-list {
    margin-top: 8px;
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    gap: 1em;
  }
  .main-block {
    height: 254px;
    display: flex;
    border-bottom: 1px solid gray;
    padding: 2px 0;
  }

  .dinkdonk {
    animation: dinkdonk linear 0.5s infinite alternate;
    position: absolute;
    left: 50%;
    top: 0;
  }
  @keyframes dinkdonk {
    0% {
      transform: scale(0.5) translate(-10%, 10%) rotate(160deg);
    }
    20% {
      transform: scale(0.5) translate(20%, 30%) rotate(180deg);
    }
    25% {
      transform: scale(0.5) translate(-10%, 10%) rotate(160deg);
    }
    40% {
      transform: scale(0.5) translate(20%, 30%) rotate(180deg);
    }
    50% {
      transform: scale(0.5) translate(-10%, 10%) rotate(160deg);
    }
    750% {
      transform: scale(0.5) translate(20%, 30%) rotate(180deg);
    }
    80% {
      transform: scale(0.5) translate(-10%, 10%) rotate(160deg);
    }
    100% {
      transform: scale(0.5) translate(20%, 30%) rotate(180deg);
    }
  }
</style>
