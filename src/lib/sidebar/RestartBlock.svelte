<script>
  import { tippy } from "../utils/tippy";
  import { showAdviceFriend } from "$lib/utils/adviceFriend.js";

  export let poll;
  export let mini = false;

  const tooltip = {
    placement: "left",
    content: "Resets all votes and restarts current poll",
  };

  function restartPoll() {
    $poll.reset();
    showAdviceFriend("Poll was restarted!");
  }
</script>

<!-- content -->
<button class="btn btn-outline-warning w-100 text-start" use:tippy={tooltip} on:click={restartPoll}>
  <span class="material-icons">&#xf053;</span>
  {#if !mini}
    <b>Restart poll</b>
  {/if}
</button>

<style>
  button {
    font-size: inherit;
  }
</style>
