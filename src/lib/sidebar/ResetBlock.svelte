<script>
  import { tippy } from "../utils/tippy";
  import { showConfirmAdviceFriend } from "$lib/utils/adviceFriend.js";
  import { hardReset } from "$lib/utils/poll.js";

  export let mini = false;

  const tooltip = {
    placement: "left",
    content: "Clears all entries and starts a new poll",
  };

  function restartPoll() {
    showConfirmAdviceFriend("Poll will be cleared.<br>Continue?", "Yes, please", hardReset);
  }
</script>

<!-- content -->
<button class="btn btn-outline-danger w-100 text-start" use:tippy={tooltip} on:click={restartPoll}>
  <span class="material-icons">&#xe872;</span>
  {#if !mini}
    <b>Reset poll</b>
  {/if}
</button>

<style>
  button {
    font-size: inherit;
  }
</style>
