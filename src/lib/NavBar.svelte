<script>
  import TwitchButton from "./elements/TwitchButton.svelte";
  import {tippy} from "./utils/tippy.js";
</script>

<style>
  
</style>

<nav class="navbar navbar-expand bg-body-tertiary py-1">
  <div class="container-fluid">
    <a class="navbar-brand" href=".">
      <img src="favicon.png" alt="Logo" width="24" height="24" class="d-inline-block align-text-top">
      not chat.vote
    </a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto my-2 my-lg-0 align-text-bottom">
        <li class="nav-item">
          <a class="nav-link" href="https://chat.vote/" rel="noreferrer noopener" 
          use:tippy={{
            content: "Visit the original <b>chat.vote</b> site"
          }} >
            actual chat.vote
          </a>
        </li>
      </ul>
    </div>
    <div class="btn-group">
      <TwitchButton />
    </div>
  </div>
</nav>