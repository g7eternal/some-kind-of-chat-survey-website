<script>
  import { poll } from "$lib/utils/poll.js";
  import { showAdviceFriend } from "$lib/utils/adviceFriend";

  let newOptionText = "";
  let returnFocusTarget = null;

  function addPollElement () {
    const text = newOptionText.trim();
    newOptionText = "";
    
    if (!text) return;

    if ($poll.allowVote) {
      showAdviceFriend(`Stop the voting before adding new entries!`);
      return;
    }
    
    const duplicateEntry = $poll.findDuplicateEntry(text.toLowerCase());
    if (duplicateEntry) {
      showAdviceFriend(`You already have this entry:<br><i>${text}</i>`);
      return;
    }

    $poll.addEntry(
      {
        username: "~poll~owner~", 
        "display-name": "me :)",
        "render-name": "<i> me :) </i>"
      },
      text
    );

    if (returnFocusTarget) returnFocusTarget.focus();
  }
</script>

<style>
  .input-group {
    max-width: inherit;
  }
</style>

<div class="input-group my-2 px-1">
  <span class="input-group-text border-warning-subtle fs-5" id="defaultPoll_addEntryLbl">
    Add entry:
  </span>
  <input type="text" class="form-control border-warning-subtle fs-5" 
    bind:this={returnFocusTarget} bind:value={newOptionText}
    on:keydown={ (e) => { if (e.key === "Enter") addPollElement() } }
    aria-describedby="defaultPoll_addEntryLbl" placeholder="enter text here">

  <button class="btn btn-outline-success border-warning-subtle fs-5" 
    disabled={$poll.allowVote} on:click={addPollElement}>
    <span class="material-icons align-text-bottom">&#xe148;</span>
    Add to poll
  </button>
</div>