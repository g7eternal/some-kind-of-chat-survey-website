<script>
  import { scale } from "svelte/transition";
  import { getAvatar } from "$lib/utils/userAvatars";
  import { settings } from "$lib/utils/stores";
  import UnknownUserImage from "./UnknownUserImage.svelte";

  export let user;
  export let h = "auto",
    w = "";
  export let rainbow = false,
    color = "";

  const colorFix = rainbow ? "yellow" : color;
</script>

{#if $settings.hideAvatars}
  <UnknownUserImage {user} {w} {h} animate={rainbow} color={colorFix} />
{:else}
  {#await getAvatar(user)}
    <div
      style:width={w || h}
      style:height={h}
      style:background-image={`url(img/spin.gif)`}
      class="portrait loader"
    />
  {:then avatarLink}
    <div
      in:scale={{ duration: 200 }}
      style:width={w || h}
      style:height={h}
      style:background-image={`url(${avatarLink})`}
      class="portrait"
    />
  {:catch}
    <UnknownUserImage {user} {w} {h} />
  {/await}
{/if}

<style>
  .portrait {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    max-height: 30vw;
    max-width: 30vw;
    margin: auto;
  }
  .loader {
    opacity: 0.3;
  }
</style>
