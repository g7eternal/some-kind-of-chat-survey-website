<script>
  export let spoilerCaption = "Votes are hidden";
  export let scale = 1;
</script>

<style>
  .main {
    position: absolute;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    text-shadow: 0px 0px 4px gray;
    opacity: 0.7;
    user-select: none;
    filter: none;
  }
  .material-icons {
    font-size: 180px;
    margin: 0 auto;
    color: rgb(190, 160, 132) !important;
  }
  h1 {
    color: rgb(190, 160, 132) !important;
  }
</style>

<div class="main" style:transform={`scale(${scale})`}>
  <div class="m-auto text-center">
    <span class="material-icons">
      &#xe8f5;
    </span>
    <h1>{spoilerCaption}</h1>
  </div>
</div>