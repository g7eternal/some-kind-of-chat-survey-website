<script>
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { twitchAppClientId as t, requestToken as r, auth } from "$lib/utils/twitch.js";

  const authParams = ["response_type=token", "state=" + r.token, "client_id=" + t];
  if (browser)
    authParams.push(
      "redirect_uri=" + encodeURIComponent(window.location.origin + window.location.pathname)
    );

  let lastError = "",
    needsRequest = false;

  function reportToParent(o) {
    if (!browser) return;

    window.opener.postMessage(o, window.location.origin);
  }

  onMount(() => {
    if (!browser) return;

    const querySource = window.location.hash || window.location.search;
    if (!querySource) {
      needsRequest = true; // user just opened the page; reveal the "login" button
      return;
    }

    const query = querySource
      .slice(1)
      .split("&")
      .reduce((ac, cv) => {
        const queryItem = cv.split("=");
        ac[decodeURIComponent(queryItem[0])] = decodeURIComponent(queryItem[1]) || true;
        return ac;
      }, {});

    try {
      if (query.state !== r.token) {
        console.warn("CSRF Token mismatch", r.token, query.state);
        throw new Error("State token mismatch. Please refresh the page and try again.");
      }

      if (query.error) {
        throw new Error(
          decodeURIComponent(query.error_description || query.error).replace(/\+/g, " ")
        );
      }

      reportToParent({ type: "auth", result: true, token: query.access_token });
      window.close();
    } catch (e) {
      console.error("Twitch OAuth failed", e);
      lastError = e.message;
      needsRequest = true;

      reportToParent({ type: "auth", result: false, token: null });
    }
  });
</script>

<svelte:head>
  <title>Authorization</title>
</svelte:head>

<div class="d-flex h-100 flex-column justify-content-center align-items-center text-center">
  <h3>Authorize with Twitch</h3>
  <h5 class="text-warning mt-2">If you are streaming, please do not show this window.</h5>

  {#if needsRequest}
    <a
      role="button"
      class="btn btn-twitch shadow my-4 fs-4"
      href={"https://id.twitch.tv/oauth2/authorize?" + authParams.join("&")}
    >
      <img
        src="img/twitch.svg"
        alt="Twitch"
        width="24"
        height="24"
        class="d-inline-block align-text-top"
      />
      Login with Twitch
    </a>
  {:else}
    <div class="spinner-border text-secondary my-4" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  {/if}

  {#if lastError}
    <div class="mt-2 text-danger">
      {lastError}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    min-width: unset;
    min-height: unset;
  }
  .btn-twitch {
    background-color: #9933ff !important;
    border-color: transparent !important;
    color: white !important;
    transition: filter 0.15s ease-out;
    filter: none;
  }
</style>
