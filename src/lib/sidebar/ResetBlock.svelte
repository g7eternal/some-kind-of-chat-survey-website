<script>
  import { tippy } from "../utils/tippy";
  import { showConfirmAdviceFriend } from "$lib/utils/adviceFriend.js";
  import { poll, hardReset } from "$lib/utils/poll.js";

  const tooltip = {
    placement: "left",
    content: "Clears all entries and starts a new poll"
  };

  function restartPoll () {
    showConfirmAdviceFriend(
      "Poll will be cleared.<br>Continue?",
      "Yes, please",
      hardReset
    );
  }
</script>

<!-- content -->
<button class="btn btn-outline-danger w-100 text-start" 
  use:tippy={tooltip}
  on:click={restartPoll}>
  <span class="material-icons">&#xe872;</span>
  <b>Reset poll</b>
</button>