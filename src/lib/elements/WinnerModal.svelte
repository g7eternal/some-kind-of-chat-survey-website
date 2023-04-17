<script>
  import { Modal } from "sveltestrap";
  import { Confetti } from "svelte-confetti";
  import { createEventDispatcher } from "svelte";
  import UserProfileLink from "./UserProfileLink.svelte";

  export let winner = null,
    html = false;

  const dispatch = createEventDispatcher();

  let open = true;
  function toggle() {
    open = !open;
    dispatch("toggle", open);
  }
</script>

{#if winner}
  <Modal body header="The winner is:" isOpen={open} {toggle} centered={true}>
    <div class="winner">
      {#if html}
        {@html winner.renderText || "???"}
      {:else}
        {winner.text || "???"}
      {/if}
    </div>

    {#if winner.author}
      <div class="author">
        <span class="text-secondary">Suggested by:</span>
        <UserProfileLink user={winner.username}>
          {@html winner.renderName}
        </UserProfileLink>
      </div>
    {/if}
  </Modal>

  <!-- confetti -->
  {#if open}
    <div class="confetti">
      <Confetti
        x={[-5, 5]}
        y={[0, 0.1]}
        delay={[0, 2000]}
        colorArray={["yellow", "lime", "green", "yellow"]}
        size="12"
        infinite
        duration="5000"
        amount="555"
        fallDistance="100vh"
      />
    </div>
  {/if}
{/if}

<style>
  .winner {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 170%;
  }
  .author {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 8px;
  }
  .confetti {
    position: fixed;
    top: -50px;
    left: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    overflow: hidden;
    pointer-events: none;
  }
  .winner :global(.tw-circle) {
    border: 4px solid white;
    border-radius: 100%;
    font-size: 28px;
    padding-top: 14px;
    width: 80px;
    height: 80px;
    text-transform: uppercase;
    display: flex;
    flex-flow: column nowrap;
    text-align: center;
    color: white;
    margin: auto;
  }
  .winner :global(.voteyea) {
    background-color: darkgreen;
  }
  .winner :global(.votenay) {
    background-color: darkred;
  }
</style>
