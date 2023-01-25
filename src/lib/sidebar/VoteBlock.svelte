<script>
  import { tippy } from "../utils/tippy";
  import { settings } from "$lib/utils/stores.js";
  import { showAdviceFriend } from "$lib/utils/adviceFriend.js";
	import WinnerModal from "../elements/WinnerModal.svelte";

  export let poll;

  const voteHelper = {
    placement: "right",
    content: "<h3>Vote command</h3>Vote message must start with this text", 
  };

  function doValidation () {
    if ($settings.suggestCommand === $settings.voteCommand) {
      showAdviceFriend("Your <b>vote</b> and <b>suggest</b> commands are identical! This will not work well.");
    }
  }

  function startVoting () {
    try {
      $poll.startVoting();
    } catch (e) {
      showAdviceFriend(e.message);
    }
  }

  let lastWinner = null;
  function stopVoting () {
    try {
      const winner = $poll.startVoting().getWinner();
      console.info("The winner is:", winner);

      lastWinner = winner;
    } catch (e) {
      showAdviceFriend(e.message);
    }
  }

  function clearLastWinner () {
    lastWinner = null;
  }
</script>

<style>
  button {
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
    box-shadow: 0px 0px 4px rgba(255, 0, 0, 0.7);
  }
</style>

<!--content-->
{#if $poll.allowVote}

<!-- $poll is active -->
<button class="btn btn-danger w-100" on:click={stopVoting}>
  <span class="material-icons">&#xe801;</span>
  <b>Stop and show winner</b>
</button>

{:else}

<!-- $poll is closed -->
<button class="btn btn-success w-100" on:click={startVoting}>
  <span class="material-icons">&#xe801;</span>
  <b>Start voting</b>
</button>

{/if}


<div class="input-group">
  <span class="input-group-text material-icons helper px-1"
    use:tippy={voteHelper}>
    &#xe88e;
  </span>
  <input type="text" class="form-control bottom-left" disabled={$poll.allowVote}
    class:invalid={$settings.suggestCommand === $settings.voteCommand}
    on:change={doValidation}
    placeholder="Command" aria-label="Vote command" bind:value={$settings.voteCommand}>
</div>

<!-- celebratory block -->
{#if lastWinner}
  <WinnerModal winner={lastWinner} html={Boolean($poll.yes_no)} on:toggle={clearLastWinner} />
{/if}