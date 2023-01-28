<script>
  import { fly } from "svelte/transition";
	import UserProfileLink from "./UserProfileLink.svelte";
  import { raffle } from "$lib/utils/raffle";
  import { tippy } from "$lib/utils/tippy";

  export let entry;

  function removeAndBlockUser () {
    $raffle.removeUser(entry.username);
  }
</script>

<style>
  .badge {
    background-color: rgba(64, 64, 64, 0.4);
    color: silver;
    font-weight: normal;
    border: 1px solid transparent;
    filter: brightness(1.3);
    cursor: pointer;
    user-select: none;
    text-shadow: 0px 0px 2px black;
    font-size: 14px;
  }
  .btn-closer {
    padding: 0;
    height: 100%;
    min-height: unset;
    background: none;
    border: none;
    color: rgb(96, 96, 80);
    filter: none;
    transition: filter .2s ease-out;
  }
  .btn-closer:hover {
    filter: brightness(2) saturate(2);
  }
  .btn-closer .material-icons {
    font-size: 16px;
    vertical-align: top;
    margin-left: 4px;
  }

  .hoverable:hover {
    text-decoration: underline;
    text-decoration-color: rgb(96, 96, 80);
  }
</style>

{#key entry}
<div class="badge" style:border-color={entry.usercolor} in:fly={{duration:10.1, x:-100}}>
  <UserProfileLink user={entry.username}>
    <span class="hoverable">{entry.author}</span>
  </UserProfileLink>
  <button class="btn-closer" on:click={removeAndBlockUser}
    use:tippy={{content:"Remove user from this raffle", delay:[350, 0]}}>
    <span class="material-icons">
      &#xe14b;
    </span>
  </button>
</div>
{/key}