<script>
  import { chat } from "$lib/utils/stores.js";
  import { setChannel } from "$lib/utils/chat.js";
  import { doUserAuth, auth } from "$lib/utils/twitch.js";
  import { hardReset as mainPollHardReset } from "../utils/poll";
  import { raffle } from "../utils/raffle";
  import { yesNoPoll } from "../utils/yes_no";
  import UserImage from "./UserImage.svelte";
	import UserProfileLink from "./UserProfileLink.svelte";

  function showAuthWindow () {
    window.open("authorize", "_blank", "popup,width=300,height=300");
  }

  function parseAuthData (event) {
    console.log(event);
    if (!event.data || event.data.type !== "auth") return;

    if (event.origin !== window.location.origin) {
      console.warn("Event ignored: bad origin", event);
      return;
    }

    if (event.data.result) {
      doUserAuth(event.data.token);
    } else {
      logOut();
    }
  }

  function logOut () {
    doUserAuth(null);
    setChannel("", true);
    $yesNoPoll.reset();
    $raffle.reset();
    mainPollHardReset();
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

<svelte:window on:message={parseAuthData} />

<!--content-->
{#if ($chat?.connected && $auth?.valid)}

<div class="text-end">
  <span class="d-block small-caption">Connected to:</span>
  <UserProfileLink user={$chat.channel}>
    <b class="m-0">{$chat.channel}</b>
  </UserProfileLink>
</div>
<div class="my-auto mx-2">
  <UserImage user={$chat.channel} h="38px" rainbow={true} />
</div>
<div>
  <button class="btn btn-outline btn-twitch text-start" on:click={logOut}>
    <span class="material-icons">&#xe9ba;</span>
    Log out
  </button>
</div>

{:else if (!$chat?.connected && !$auth?.valid)}

  {#if $chat?.busy || $auth?.busy}

  <div class="spinner-border text-secondary" role="status" title="Connecting...">
    <span class="visually-hidden">Connecting...</span>
  </div>

  {:else}

  <button class="btn btn-twitch shadow" on:click={showAuthWindow}>
    <img src="img/twitch.svg" alt="Twitch" width="24" height="24" class="d-inline-block align-text-top">
    Login with Twitch
  </button>

  {/if}

{:else}

<div class="spinner-border text-secondary" role="status" title="Loading...">
  <span class="visually-hidden">Loading...</span>
</div>

{/if}