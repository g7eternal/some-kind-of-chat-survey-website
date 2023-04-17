<script>
  import { tippy } from "../utils/tippy";
  import { settings } from "$lib/utils/stores.js";
  import { poll } from "$lib/utils/poll.js";
  import { showAdviceFriend } from "$lib/utils/adviceFriend.js";

  export let mini = false;

  const suggestHelper = {
    placement: "right",
    content: "<h3>Suggest command</h3>Suggestion message must start with this text",
  };

  function doValidation() {
    if ($settings.suggestCommand === $settings.voteCommand) {
      showAdviceFriend(
        "Your <b>vote</b> and <b>suggest</b> commands are identical!<br>This will not work well."
      );
    }
  }

  function toggleSuggestions() {
    try {
      if ($poll.allowSuggest) {
        $poll.blockSuggestions();
      } else {
        $poll.allowSuggestions();
      }
    } catch (e) {
      showAdviceFriend(e.message);
    }
  }
</script>

<!--content-->
{#if !mini}
  <h6>Chat suggestions:</h6>
{/if}

<button
  class="btn w-100 text-start"
  class:hasNeighbors={!mini}
  class:btn-success={!$poll.allowSuggest}
  class:btn-danger={$poll.allowSuggest}
  use:tippy={{
    placement: "left",
    content: $poll.allowSuggest
      ? "Stop accepting user suggestions"
      : "Allow users to suggest poll entries",
  }}
  on:click={toggleSuggestions}
>
  <span class="material-icons">&#xe175;</span>
  {#if !mini}
    {$poll.allowSuggest ? "Disable" : "Enable"} suggestions
  {/if}
</button>

{#if !mini}
  <div class="input-group">
    <span class="input-group-text material-icons helper px-1" use:tippy={suggestHelper}>
      &#xe88e;
    </span>
    <input
      type="text"
      class="form-control bottom-left"
      placeholder="Command"
      class:invalid={$settings.suggestCommand === $settings.voteCommand}
      on:change={doValidation}
      aria-label="Suggestion command"
      bind:value={$settings.suggestCommand}
    />
  </div>
{/if}

<style>
  button,
  input {
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
