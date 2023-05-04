<script>
  import { settings } from "../utils/stores";
  export let count = 0,
    max = 10,
    rating = 10;
</script>

<div
  class:spoiler={$settings.hideVotes}
  class="main"
  style:transform={`scale(${0.8 + 0.4 * (rating / max)})`}
>
  {#if $settings.hideVotes}
    <img src="img/donkwait.webp" alt="Wait" />
    <div class="count">Votes are hidden</div>
  {:else}
    <div>
      {rating.toPrecision(Math.max(Math.log10(max), 1) + 1)}
    </div>
    <div class="count">
      {count}
      <span class="opacity-75">votes</span>
    </div>
  {/if}
</div>

<style>
  .main {
    position: relative;
    margin: auto;
    border: 4px solid white;
    border-radius: 1em;
    font-size: 48px;
    font-weight: bold;
    padding: 16px;
    width: auto;
    min-width: 150px;
    height: 150px;
    text-transform: uppercase;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    transform: none;
    transition: transform 0.5s ease-out;
    background-color: rgba(168, 192, 0, 0.2);
  }
  img {
    width: 30%;
    height: auto;
  }
  .spoiler {
    transform: none !important;
  }
  .count {
    font-size: 40%;
    opacity: 0.7;
  }
</style>
