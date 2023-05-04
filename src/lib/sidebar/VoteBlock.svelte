<script>
  import { tippy } from "../utils/tippy";
  import { PollEntry } from "$lib/utils/poll.js";
  import { settings } from "$lib/utils/stores.js";
  import { showAdviceFriend } from "$lib/utils/adviceFriend.js";
  import WinnerModal from "../elements/WinnerModal.svelte";

  export let poll;
  export let mini = false;

  const voteHelper = {
    placement: "right",
    content: "<h3>Vote command</h3>Vote message must start with this text",
  };
  const rateHelper = {
    placement: "right",
    content: "<h3>Max rating</h3>Users will rate an item on a scale from 1 to this number",
  };

  function doValidation() {
    if ($settings.suggestCommand === $settings.voteCommand) {
      showAdviceFriend(
        "Your <b>vote</b> and <b>suggest</b> commands are identical! This will not work well."
      );
    }
  }

  function doRatingValidation() {
    if ($poll.rateCeiling < $poll.rateFloor) {
      showAdviceFriend(
        "People usually rate stuff as a one-to-something. Therefore max rating should be more than 1."
      );
    }
  }

  function startVoting() {
    try {
      $poll.startVoting();
    } catch (e) {
      showAdviceFriend(e.message);
    }
  }

  let lastWinner = null;
  function stopVoting() {
    try {
      if ($poll.type === "rating") {
        const totalRating = $poll.startVoting().getWinner();
        if (!totalRating) {
          // no winner? nobody voted?
          lastWinner = totalRating;
          return;
        }
        const stringRating = totalRating.toPrecision(
          Math.max(Math.log10($poll.rateCeiling), 1) + 1
        );

        console.info("Final rating is:", totalRating);
        lastWinner = new PollEntry(-1, {}, stringRating);
        lastWinner.renderText = `<b class="text-warning">${stringRating}</b> out of <b class="text-success">${$poll.rateCeiling}</b>`;

        return;
      }

      lastWinner = $poll.startVoting().getWinner();
      console.info("The winner is:", lastWinner);
    } catch (e) {
      console.error(e);
      showAdviceFriend(e.message);
    }
  }

  function toggleVoting() {
    if ($poll.allowVote) stopVoting();
    else startVoting();
  }

  function clearLastWinner() {
    lastWinner = null;
  }
</script>

<!--content-->

<button
  class="btn w-100 text-start"
  class:btn-danger={$poll.allowVote}
  class:btn-success={!$poll.allowVote}
  class:button-in-block={$poll.type === "poll" && !mini}
  use:tippy={{
    placement: "left",
    content: $poll.allowVote ? "Ends current poll and shows the winner" : "Starts the poll",
  }}
  on:click={toggleVoting}
>
  {#if $poll.allowVote}
    <span class="material-icons">&#xe801;</span>
    {#if !mini}
      <b>Stop and show winner</b>
    {/if}
  {:else}
    <span class="material-icons">&#xe801;</span>
    {#if !mini}
      <b>Start voting</b>
    {/if}
  {/if}
</button>

{#if $poll.type === "rating" && !mini}
  <div class="input-group">
    <span class="input-group-text material-icons helper px-1" use:tippy={rateHelper}>
      &#xe8e5;
    </span>
    <input
      type="number"
      min={$poll.rateFloor}
      max={1000}
      class="form-control bottom-left"
      disabled={$poll.allowVote}
      class:invalid={$poll.rateFloor > $poll.rateCeiling}
      on:change={doRatingValidation}
      placeholder="Max rating"
      aria-label="Max rating number"
      bind:value={$poll.rateCeiling}
    />
  </div>
{/if}

{#if $poll.type === "poll" && !mini}
  <div class="input-group">
    <span class="input-group-text material-icons helper px-1" use:tippy={voteHelper}>
      &#xe88e;
    </span>
    <input
      type="text"
      class="form-control bottom-left"
      disabled={$poll.allowVote}
      class:invalid={$settings.suggestCommand === $settings.voteCommand}
      on:change={doValidation}
      placeholder="Command"
      aria-label="Vote command"
      bind:value={$settings.voteCommand}
    />
  </div>
{/if}

<!-- celebratory block -->
{#if lastWinner}
  <WinnerModal
    winner={lastWinner}
    html={true}
    on:toggle={clearLastWinner}
    header={$poll._winHeader}
  />
{/if}

<style>
  button,
  input {
    font-size: inherit;
  }
  .button-in-block {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
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
