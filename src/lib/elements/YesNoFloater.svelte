<script>
  import { settings } from "../utils/stores";
  export let text, count = 0, scale = 1;
</script>

<style>
  .main {
    position: relative;
    margin: auto;
    border: 12px solid white;
    border-radius: 100%;
    font-size: 48px;
    padding-top: 16px;
    width: 150px;
    height: 150px;
    text-transform: uppercase;
    display: flex;
    flex-flow: column nowrap;
    text-align: center;
    color: white;
    transform: none;
    transition: transform .5s ease-out;
  }
  .yes {
    background-color: darkgreen;
  }
  .no {
    background-color: darkred;
  }
  .spoiler {
    transform: none !important;
  }
  .count {
    font-size: 40%;
    opacity: 0.7;
  }
</style>

<div 
  class:yes={text==="YEA"} 
  class:no={text==="NAY"}
  class:spoiler={$settings.hideVotes}
  class="main" style:transform={`scale(${scale})`}>
  <div>{text}</div>

  {#if !$settings.hideVotes}
  <div class="count">
    {count}
  </div>
  {/if}
</div>