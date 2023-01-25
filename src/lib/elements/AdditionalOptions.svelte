<script>
  import { Offcanvas } from "sveltestrap";
  
  let isOpen = false;
  function toggle () {
    isOpen = !isOpen;
  }
</script>

<style>
  p {
    margin: 12px 0;
  }
</style>

<!-- toggler button (mounts into wherever) -->
<button class="btn btn-secondary w-100 text-start" on:click={toggle}>
  <span class="material-icons">&#xe8b9;</span>
  More settings...
</button>

<!-- offcanvas content-->
<Offcanvas {isOpen} {toggle} placement="start" header="About this page">
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