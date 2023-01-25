<script>
  import { tippy } from "../utils/tippy";
  import { settings } from "$lib/utils/stores.js";
  import { poll } from "$lib/utils/poll.js";
  import { showAdviceFriend } from "$lib/utils/adviceFriend.js";

  const suggestHelper = {
    placement: "right",
    content: "<h3>Suggest command</h3>Suggestion message must start with this text", 
  };

  function doValidation () {
    if ($settings.suggestCommand === $settings.voteCommand) {
      showAdviceFriend("Your <b>vote</b> and <b>suggest</b> commands are identical!<br>This will not work well.");
    }
  }

  function toggleSuggestions () {
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
    box-shadow: 0px 0px 8px rgba(255, 0, 0, 0.7);
  }
</style>

<!--content-->
<h6>Chat suggestions:</h6>

<button class="btn w-100"
  class:btn-success={!$poll.allowSuggest}
  class:btn-danger={$poll.allowSuggest}
  on:click={toggleSuggestions}>
  <span class="material-icons">&#xe175;</span>
  {$poll.allowSuggest ? "Disable" : "Enable"} suggestions
</button>

<div class="input-group">
  <span class="input-group-text material-icons helper px-1"
    use:tippy={suggestHelper}>
    &#xe88e;
  </span>
  <input type="text" class="form-control bottom-left" placeholder="Command" 
    class:invalid={$settings.suggestCommand === $settings.voteCommand}
    on:change={doValidation}
    aria-label="Suggestion command" bind:value={$settings.suggestCommand}>
</div>