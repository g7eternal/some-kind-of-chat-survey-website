<script>
  import { settings } from "$lib/utils/stores.js";
  import { yesNoPoll } from "./utils/yes_no";
  import { poll } from "./utils/poll";
  import { raffle } from "./utils/raffle";
  import { tippy } from "./utils/tippy";
  import { showAdviceFriend } from "./utils/adviceFriend";

  import SuggestBlock from "./sidebar/SuggestBlock.svelte";
  import VoteBlock from "./sidebar/VoteBlock.svelte";
  import AdditionalOptions from "./elements/AdditionalOptions.svelte";
  import RestartBlock from "./sidebar/RestartBlock.svelte";
  import ResetBlock from "./sidebar/ResetBlock.svelte";
  import RaffleJoinBlock from "./sidebar/RaffleJoinBlock.svelte";
  import RaffleDrawWinnerBlock from "./sidebar/RaffleDrawWinnerBlock.svelte";
  
  export let currentBlock;

  function switchActive (event) { // toggles main section
    const newActive = event.currentTarget.dataset.scene;

    currentBlock = newActive; 

    if (newActive === "raffle" && $settings.firstRaffle) {
      $settings.firstRaffle = false;
      showAdviceFriend(
        "You can use this to choose a random user from your chat. Might come in handy, if you're looking for a way to organise some kind of lottery.",
        "Raffle mode"
      )
    }
  }

  export let visibility = true;
  let userVisibility = null;

  let presence = true;
  $: presence = (userVisibility !== null) ? userVisibility : visibility;

  function toggleUserVisibility () {
    if (userVisibility === null) userVisibility = visibility;
    userVisibility = !userVisibility;
  }
</script>

<style>
  .sidebar {
    height: 100%;
    width: 16em;
    position: relative;
    font-size: 100%;
    transition: width .3s ease, font-size .3s ease;
  }
  ul {
    height: 100%;
    width: 100%;
  }
  li {
    padding: 4px;
  }

  .nav :global(h6) {
    font-size: 1em;
    opacity: 0.7;
    padding: 8px 2px;
  }
  
  small {
    display: block;
    font-size: 70%;
  }
  label:hover {
    text-shadow: 0px 0px 1px rgba(255, 255, 128, 0.4);
  }

  button, input, .btn {
    font-size: inherit;
    text-align: left;
  }

  .btn-slider {
    position: absolute;
    top: 50%;
    right: 100%;
    width: 20px;
    height: 32px;
    font-size: 32px;
    border: 0;
    border-top-left-radius: 100%;
    border-bottom-left-radius: 100%;
    display: flex;
    padding: 0 0 0 0;
    transform: none;
    transition: transform .2s ease;
  }
  .btn-slider:hover {
    transform: scale(1.1);
  }
  .btn-slider span {
    margin: auto;
    font-size: inherit;
    transform: rotate(90deg) scale(1.1, -1.1) translateY(-2px);
    opacity: 0.3;
    text-shadow: 0px 0px 2px transparent;
    filter: none;
    transition: text-shadow .2s ease, filter .2s ease, transform .3s ease-out;
  }
  .btn-slider:hover span {
    text-shadow: 0px 0px 2px yellow;
    filter: brightness(1.2) saturate(1.2);
  }

  /* collapsed sidebar styles (only buttons, narrow) */
  .sidebar.collapsed {
    width: 60px;
    font-size: 1%;
  }
  .sidebar.collapsed .btn-slider span {
    transform: rotate(90deg) scale(-1.1, 1.1) translateY(4px);
  }

  @media all and (orientation:portrait) {
    .sidebar {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 100;
    }
  }
</style>

<!-- content -->
<div class="sidebar" class:collapsed={!presence}>

<button class="btn-slider bg-body-secondary text-warning"
  aria-label={presence ? "Collapse sidebar" : "Expand sidebar"}
  on:click={toggleUserVisibility}>
  <span class="material-icons">&#xe5cf;</span>
</button>

<ul class="nav flex-column bg-body-secondary border-end">

  {#if currentBlock === "default"}

    <li class="nav-item">
      <VoteBlock poll={poll} mini={!presence} />

      {#if presence}
      <div class="form-check my-1">
        <input class="form-check-input" type="checkbox" value=""
          id="pollOptions_hideVotes" bind:checked={$settings.hideVotes}>
        <label class="form-check-label" for="pollOptions_hideVotes">
          <span class="material-icons">&#xe8f5;</span>
          Hide vote count
        </label>
      </div>
      {/if}
    </li>

    <li class="nav-item">
      <SuggestBlock  mini={!presence} />
    </li>
    
  {/if}

  {#if currentBlock === "yesno"}

    <li class="nav-item">
      <VoteBlock poll={yesNoPoll} mini={!presence} />

      {#if presence}
      <div class="form-check my-1">
        <input class="form-check-input" type="checkbox" value=""
          id="pollOptions_hideVotes" bind:checked={$settings.hideVotes}>
        <label class="form-check-label" for="pollOptions_hideVotes">
          <span class="material-icons">&#xe8f5;</span>
          Hide vote count
        </label>
      </div>
      {/if}

    </li>
    
  {/if}

  {#if currentBlock === "raffle"}

    <li class="nav-item">
      <RaffleJoinBlock mini={!presence} />
    </li>

    {#if presence}
    <li class="nav-item">
      <div class="form-check my-1">
        <input class="form-check-input" type="checkbox" value=""
          id="pollOptions_hideAvatars" bind:checked={$settings.hideAvatars}>
        <label class="form-check-label" for="pollOptions_hideAvatars">
          <span class="material-icons">&#xe8f5;</span>
          Hide profile images
        </label>
      </div>
    </li>
    {/if}

    <li class="nav-item">
      <RaffleDrawWinnerBlock mini={!presence} />
    </li>
    
  {/if}

  <li class="nav-item">
    <AdditionalOptions mini={!presence} />
  </li>

  <li class="nav-item flex-grow-1">
    <!--padder-->
  </li>

  {#if currentBlock === "default"}
    <li class="nav-item">
      <RestartBlock poll={poll} mini={!presence} />
    </li>
    <li class="nav-item">
      <ResetBlock mini={!presence} />
    </li>
  {/if}

  {#if currentBlock === "yesno"}
    <li class="nav-item">
      <RestartBlock poll={yesNoPoll} mini={!presence} />
    </li>
  {/if}

  {#if currentBlock === "raffle"}
    <li class="nav-item">
      <RestartBlock poll={raffle} mini={!presence} />
    </li>
  {/if}

  <li class="nav-item">
    {#if presence}
    <h6>Poll mode:</h6>
    {/if}

    <div class="btn-group-vertical w-100">
      <input type="radio" class="btn-check" name="togglePollMode" 
        on:change={switchActive} data-scene="default"
        id="pollMode_default" autocomplete="off" checked>
      <label class="btn btn-outline-secondary" for="pollMode_default"
        use:tippy={{placement: "left", content: "Switch to <b>default poll</b>", allowHTML: true}}>
        <span class="material-icons">&#xe172;</span> 
        {#if presence}
          Default mode
          <small>Poll users on a list of any items</small>
        {/if}
      </label>

      <input type="radio" class="btn-check" name="togglePollMode" 
        on:change={switchActive} data-scene="yesno"
        id="pollMode_yesno" autocomplete="off">
      <label class="btn btn-outline-secondary" for="pollMode_yesno"
        use:tippy={{placement: "left", content: "Switch to <b>Yes/No poll</b>", allowHTML: true}}>
        <span class="material-icons">&#xef50;</span> 
        {#if presence}
          Yes/No mode
          <small>Poll with only "Yes" or "No" options</small>
        {/if}
      </label>

      <input type="radio" class="btn-check" name="togglePollMode" 
        on:change={switchActive} data-scene="raffle"
        id="pollMode_raffle" autocomplete="off">
      <label class="btn btn-outline-secondary" for="pollMode_raffle"
        use:tippy={{placement: "left", content: "Switch to <b>raffle mode</b>", allowHTML: true}}>
        <span class="material-icons">&#xea74;</span>
        {#if presence}
          Raffle mode
          <small>Pick a random active chatter</small>
        {/if}
      </label>
    </div>
  </li>

</ul>

</div>