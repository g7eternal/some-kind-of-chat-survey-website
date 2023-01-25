<script>
  import { settings } from "$lib/utils/stores.js";
  import { yesNoPoll } from "./utils/yes_no";
  import { poll } from "./utils/poll";

	import SuggestBlock from "./sidebar/SuggestBlock.svelte";
  import VoteBlock from "./sidebar/VoteBlock.svelte";
  import AdditionalOptions from "./elements/AdditionalOptions.svelte";
	import RestartBlock from "./sidebar/RestartBlock.svelte";
  import ResetBlock from "./sidebar/ResetBlock.svelte";
	

  export let currentBlock;

  function switchActive (event) { // toggles main section
    const newActive = event.currentTarget.dataset.scene;

    currentBlock = newActive; 
  }
</script>

<style>
  ul {
    max-width: 20em;
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
  .btn {
    text-align: left;
  }

  label:hover {
    text-shadow: 0px 0px 1px rgba(255, 255, 128, 0.4);
  }
</style>

<!-- content -->
<ul class="nav flex-column bg-body-secondary border-end">

  {#if currentBlock === "default"}

    <li class="nav-item">
      <VoteBlock poll={poll} />
      <div class="form-check my-1">
        <input class="form-check-input" type="checkbox" value=""
          id="pollOptions_hideVotes" bind:checked={$settings.hideVotes}>
        <label class="form-check-label" for="pollOptions_hideVotes">
          <span class="material-icons">&#xe8f5;</span>
          Hide vote count
        </label>
      </div>
    </li>

    <li class="nav-item">
      <SuggestBlock />
    </li>
    
  {/if}

  {#if currentBlock === "yesno"}

    <li class="nav-item">
      <VoteBlock poll={yesNoPoll} />
      <div class="form-check my-1">
        <input class="form-check-input" type="checkbox" value=""
          id="pollOptions_hideVotes" bind:checked={$settings.hideVotes}>
        <label class="form-check-label" for="pollOptions_hideVotes">
          <span class="material-icons">&#xe8f5;</span>
          Hide vote count
        </label>
      </div>
    </li>
    
  {/if}

  <li class="nav-item">
    <AdditionalOptions />
  </li>

  <li class="nav-item flex-grow-1">
    <!--padder-->
  </li>

  {#if currentBlock === "default"}
    <li class="nav-item">
      <RestartBlock poll={poll} />
    </li>
    <li class="nav-item">
      <ResetBlock />
    </li>
  {/if}

  {#if currentBlock === "yesno"}
    <li class="nav-item">
      <RestartBlock poll={yesNoPoll} />
    </li>
  {/if}

  <li class="nav-item">
    <h6>Poll mode:</h6>

    <div class="btn-group-vertical w-100">
      <input type="radio" class="btn-check" name="togglePollMode" 
        on:change={switchActive} data-scene="default"
        id="pollMode_default" autocomplete="off" checked>
      <label class="btn btn-outline-secondary" for="pollMode_default">
        <span class="material-icons">&#xe172;</span> Default mode
        <small>Poll users on a list of any items</small>
      </label>

      <input type="radio" class="btn-check" name="togglePollMode" 
        on:change={switchActive} data-scene="yesno"
        id="pollMode_yesno" autocomplete="off">
      <label class="btn btn-outline-secondary" for="pollMode_yesno">
        <span class="material-icons">&#xef50;</span> Yes/No mode
        <small>Poll with only "Yes" or "No" options</small>
      </label>

      <input type="radio" class="btn-check" name="togglePollMode" 
        on:change={switchActive} data-scene="raffle"
        id="pollMode_raffle" autocomplete="off">
      <label class="btn btn-outline-secondary" for="pollMode_raffle">
        <span class="material-icons">&#xea74;</span> Raffle mode
        <small>Pick a random active chatter</small>
      </label>
    </div>
  </li>

</ul>