<script>
  import { Accordion, AccordionItem, Offcanvas } from "sveltestrap";
  import { raffle } from "../utils/raffle";
  import { tippy } from "../utils/tippy";

  export let mini = false;
  
  let isOpen = false;
  let history = [];

  function toggle () {
    isOpen = !isOpen;
    if (isOpen) history = buildWinnerHistory();
  }

  function buildWinnerHistory () {
    const list = Array.from($raffle.winnerHistory.values());
    return list.filter(el => el !== null).sort((a,b) => b.winOrder - a.winOrder);
  }
</script>

<style>
  #revealRaffleHistory {
    font-size: inherit;
  }
  :global(.accordion-header) {
    filter: hue-rotate(270deg);
  }
</style>

<!-- toggler button (mounts into wherever) -->
<button class="btn btn-outline-primary w-100 text-start mb-2"
  disabled={$raffle.winnerHistory.size < 1}
  use:tippy={{placement: "left", content: "View previous winners and their messages"}}
  on:click={toggle} id="revealRaffleHistory">
  <span class="material-icons">&#xe889;</span>
  {#if !mini}
    Previous winners
  {/if}
</button>

<!-- offcanvas content-->
<Offcanvas {isOpen} {toggle} placement="start" header="Raffle history">
  {#if history.length}

  <Accordion>
    {#each history as entry}
    <AccordionItem>
      <h4 class="m-0" slot="header">
        <strong>[{entry.winOrder}]</strong>
        {entry.author}
      </h4>
      <div class="messagelist">
      {#if entry.messages?.length}
        {#each entry.messages as message}
          <div>
            {@html entry.renderName}:
            {@html message}
          </div>
        {/each}
      {:else}
        <em class="text-secondary">No messages</em>
      {/if}
      </div>
    </AccordionItem>
    {/each}
  </Accordion>

  {:else}

  <div class="spinner-border text-secondary" role="status" title="Loading...">
    <span class="visually-hidden">Loading...</span>
  </div>

  {/if}
</Offcanvas>

