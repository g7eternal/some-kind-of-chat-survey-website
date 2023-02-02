<script>
  import { tippy } from "../utils/tippy";
  import { settings } from "$lib/utils/stores.js";
  import { raffle as poll } from "$lib/utils/raffle.js";
  import { showAdviceFriend } from "$lib/utils/adviceFriend.js";

  export let mini = false;

  const suggestHelper = {
    placement: "right",
    content: "<h3>Join command</h3>People can join by typing this message", 
  };

  function doValidation () {
    if (!$settings.raffleCommand) {
      showAdviceFriend("The <b>join</b> command for your raffle is not specified. Nobody can join the raffle.");
    }
  }

  function toggleJoining () {
    try {
      if ($poll.allowVote) {
        $poll.blockEntering();
      } else {
        $poll.allowEntering();
      }
    } catch (e) {
      showAdviceFriend(e.message);
    }
  }
</script>

<style>
  button, input {
    font-size: inherit;
  }
  .hasNeighbors {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    text-align: left;
  }
  .bottom-left {
    border-top-right-radius: 0;
  }
  .helper {
    border-top-left-radius: 0;
    cursor: pointer;
  }
  .invalid {
    box-shadow: 0px 0px 8px rgba(255, 0, 0, 0.7);
  }
</style>

<!--content-->
<button class="btn w-100 text-start"
  class:hasNeighbors={!mini}
  class:btn-success={!$poll.allowVote}
  class:btn-danger={$poll.allowVote}
  use:tippy={{placement: "left", content: (
    $poll.allowVote ? 
    "Closes the raffle and disallows joining" :
    "Allows users to join the raffle"
  )}}
  on:click={toggleJoining}>
  <span class="material-icons">&#xe175;</span>
  {#if !mini}
    {$poll.allowVote ? "Close" : "Open"} raffle
  {/if}
</button>

{#if !mini}
<div class="input-group">
  <span class="input-group-text material-icons helper px-1"
    use:tippy={suggestHelper}>
    &#xe88e;
  </span>
  <input type="text" class="form-control bottom-left" placeholder="Command" 
    class:invalid={!$settings.raffleCommand}
    on:change={doValidation}
    aria-label="Suggestion command" bind:value={$settings.raffleCommand}>
</div>
{/if}