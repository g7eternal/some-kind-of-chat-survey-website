<script>
  import { auth } from "$lib/utils/twitch";

  export let user;

  let link = `https://www.twitch.tv/popout/${$auth.channel}/viewercard/${user}`;

  function openViewerCard(event) {
    event.preventDefault();

    window.open(link, "_blank", "popup,width=300,height=450");
  }
</script>

<a on:click={openViewerCard} target="_blank" rel="noreferrer" href={link}>
  <slot />
</a>

<style>
  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    filter: none;
    transition: filter 0.2s ease-out;
  }
  a:hover {
    filter: brightness(1.3);
  }
</style>
