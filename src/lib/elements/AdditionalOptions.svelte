<script>
  import { tippy } from "../utils/tippy";
  import { Offcanvas } from "sveltestrap";

  export let mini = false;
  
  let isOpen = false;
  function toggle () {
    isOpen = !isOpen;
  }
</script>

<style>
  #openAdditionalSettings {
    font-size: inherit;
  }
  p {
    margin: 12px 0;
  }
</style>

<!-- toggler button (mounts into wherever) -->
<button class="btn btn-secondary w-100 text-start" 
  use:tippy={{placement: "left", content: "Show additional settings"}}
  on:click={toggle} id="openAdditionalSettings">
  <span class="material-icons">&#xe8b9;</span>
  {#if !mini}
    More settings...
  {/if}
</button>

<!-- offcanvas content-->
<Offcanvas {isOpen} {toggle} placement="start" header="Additional settings">
  <div class="d-flex h-25">
    <h5 class="m-auto">
      <img src="./img/donkchat.gif" alt="DonkChat" width="48" height="48">
      This section is under construction.
    </h5>
  </div>
  <hr>
  <h4>About this page</h4>
  <p>
    This page is an experimental redesign of
    <a href="https://chat.vote" rel="noopener noreferrer">chat.vote</a>
    voting website. The original one is really good, but boring.
  </p>
  <p>
    As such, functionality of this page is limited to basic things.
    Don't expect a lot of custom features the original website has,
    as it was in development way longer than this mockup.
  </p>
  <p class="text-success-emphasis">
    If badoge reads this, vi von zulul. Remove weeb 7tv emotes, you donker!
  </p>
</Offcanvas>