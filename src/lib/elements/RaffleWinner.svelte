<script>
  import { settings } from "../utils/stores";
  import { raffle } from "../utils/raffle";
  import { raffleTimer } from "../utils/timer";
  import { tippy } from "../utils/tippy";
	import UserImage from "./UserImage.svelte";
	import UserProfileLink from "./UserProfileLink.svelte";
  import SpoilerBlock from "./SpoilerBlock.svelte";

  const imgSize = "250px";

  function toggleMsgSpoiler () {
    $settings.hideMessages = !$settings.hideMessages;
  }
</script>

<style>
  .main {
    max-width: 1200px;
    margin: auto;
  }

  .user-image {
    max-height: 30vw;
    max-width: 30vw;
  }
  .winner-name {
    text-shadow: 2px 2px 2px rgba(100, 100, 100, 0.5);
    font-weight: bold;
  }
  .message-list {
    width: 100%;
    height: 170px;
    overflow: auto;
    margin-top: auto;
    border-radius: 1em;
    border: 1px solid gray;
    display: flex;
    flex-flow: column nowrap;
  }
  .message-header {
    font-weight: bold;
    padding: 4px .5em;
    border-bottom: 1px solid gray;
    color:rgba(190, 160, 132, 0.7);
  }
  .messages {
    position: relative;
    background: rgba(20, 20, 20, 0.5);
    flex: 1 0 auto;
    padding-bottom: 32px;
  }
  .messages div {
    padding: 2px 4px;
  }
  .messages div:nth-child(2n) {
    background-color: rgba(64, 64, 64, 0.2);
  }
  .spoiler-toggle {
    background: none;
    border: 0;
    color: rgb(190, 160, 132);
    float: right;
  }
</style>

{#if $raffle.winner}
<div class="d-flex flex-row h-100 w-100 main">

  <div style:width={imgSize} style:height={imgSize} class="user-image my-auto me-2">
    <UserImage h={imgSize} w={imgSize}
      user={$raffle.winner.username} color={$raffle.winner.usercolor}
      />
  </div>

  <div class="d-flex flex-grow-1 flex-column align-items-start">
    <UserProfileLink user={$raffle.winner.username}>
      <h1 class="winner-name">{@html $raffle.winner.renderName}</h1>
    </UserProfileLink>

    <div>
      Time elapsed: <b>{$raffleTimer}</b>
    </div>

    <div class="message-list">
      <div class="message-header">
        <span class="material-icons">&#xe0b7;</span>
        Message history
        <button class="spoiler-toggle"
          use:tippy={{placement:"left", content:"Toggle message history visibility"}} 
          on:click={toggleMsgSpoiler}>
          <span class="material-icons">
            {@html $settings.hideMessages ? "&#xe8f4;" : "&#xe8f5;"}
          </span>
        </button>
      </div>
      <div class="messages">
        <SpoilerBlock text="Messages hidden" hide={$settings.hideMessages} size={80}>
          {#if $raffle.winnerMessages.length}
            {#each $raffle.winnerMessages as message}
              <div>
                {@html $raffle.winner.renderName}:
                {@html message}
              </div>
            {/each}
          {:else}
            <div class="opacity-25 w-100 text-center">
              New messages from winner will appear here
            </div>
          {/if}
        </SpoilerBlock>
      </div>
    </div>
  </div>
</div>
{/if}