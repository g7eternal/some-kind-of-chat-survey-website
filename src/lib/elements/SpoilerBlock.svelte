<script>
  export let text = "Votes are hidden";
  export let hide = false;
  export let blur = true;
  export let size = 160;
</script>

<style>
  .main {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
  }
  .inner {
    width: 100%;
    height: 100%;
  }

  .spoiler {
    position: absolute;
    z-index: 99;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-flow: column nowrap;
    text-shadow: 0px 0px 4px gray;
    opacity: 0.7;
    user-select: none;
    filter: none;
    text-align: center;
  }
  .spoiler .material-icons {
    margin: 0 auto;
    color: rgb(190, 160, 132) !important;
  }
  .spoiler h1 {
    color: rgb(190, 160, 132) !important;
    font-size: 1.2em;
  }

  .spoiler-cover {
    filter: blur(4px);
  }
</style>

<div class="main">

  <div class="inner" class:spoiler-cover={hide && blur}>
    <slot></slot>
  </div>

  {#if hide}
    <div class="spoiler">
      <span class="material-icons" style:font-size={size + "px"}>
        &#xe8f5;
      </span>
      <h1>{text}</h1>
    </div>
  {/if}

</div>