<script>
  import { chat } from "$lib/utils/stores.js";
  import { setChannel } from "$lib/utils/twitch.js";

  function askUsernameAndLogin () {
    // todo: rework with actual api and dialogs?
    const username = prompt(`> Mom, can we have "new chat.vote"?\n> No, son, we have "new chat.vote" at home.\n"new chat.vote" at home: *has no twitch api integration*\n\nJust enter your channel name for now:`);
    if (!username) return;

    setChannel(username, true);
  }

  function logOut () {
    setChannel("", true);
  }
</script>

<style>
  .btn-twitch {
    background-color: #9933ff !important;
    border-color: transparent !important;
    color: white !important;
    transition: filter .15s ease-out;
    filter: none;
  }
  .btn-twitch:hover {
    filter: contrast(0.8) brightness(1.2);
  }
  .btn-twitch:active {
    filter: contrast(2);
  }

  .btn-twitch.btn-outline {
    background-color: transparent !important;
    border-color: #9933ff !important;
  }
  
  .small-caption {
    font-size: 70%;
  }
</style>

<!--content-->
{#if $chat?.busy}

<div class="spinner-border text-secondary" role="status">
  <span class="visually-hidden">Loading...</span>
</div>

{:else if $chat?.connected}

<div class="text-end me-2">
  <span class="d-block small-caption">Connected to:</span>
  <b class="m-0">{$chat.channel}</b>
</div>
<div>
  <button class="btn btn-outline btn-twitch text-start" on:click={logOut}>
      <span class="material-icons">&#xe9ba;</span>
      Log out
  </button>
</div>

{:else}

<button class="btn btn-twitch shadow" on:click={askUsernameAndLogin}>
  <img src="img/twitch.svg" alt="Twitch" width="24" height="24" class="d-inline-block align-text-top">
  Login with Twitch
</button>

{/if}