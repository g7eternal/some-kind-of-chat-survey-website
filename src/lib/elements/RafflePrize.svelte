<script>
  let prize = "";
</script>

<style>
  .fake-input {
    border-color: rgba(64, 56, 48, 0.4) !important;
    font-weight: bold;
  }
  .main {
    max-width: 1200px;
    margin: auto;
  }
</style>

<div class="input-group my-2 px-1 main">
  <input type="text" class="form-control fs-5 text-center border-warning-subtle" 
    bind:value={prize} class:fake-input={prize.length > 0}
    placeholder="What will the winner get?">
</div>