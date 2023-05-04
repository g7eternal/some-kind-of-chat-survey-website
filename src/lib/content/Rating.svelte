<script>
  import { ratingPoll as poll } from "$lib/utils/rating.js";
  import RatingFloater from "../elements/RatingFloater.svelte";

  let question = "";
</script>

<!-- content -->

<div class="outer">
  <div class="input-group my-2 px-1 question">
    <input
      type="text"
      class="form-control fs-2 text-center border-warning-subtle"
      bind:value={question}
      class:fake-input={question.length > 0}
      placeholder="What are we rating?"
    />
  </div>

  <div class="variants">
    <RatingFloater rating={$poll.rating} max={$poll.rateCeiling} count={$poll.voters.size} />
  </div>

  <div class="motto" class:text-primary-emphasis={$poll.allowVote}>
    {$poll.allowVote
      ? `Type a number [${$poll.rateFloor}-${$poll.rateCeiling}] to share your opinion`
      : "Awaiting for the vote to start"}
  </div>
</div>

<style>
  .outer {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 300px;
    margin: 0 auto;
    display: flex;
    flex-flow: column nowrap;
  }
  .variants {
    flex: 10 0 auto;
    min-height: 300px;
    display: flex;
    width: 100%;
    height: auto;
    flex-flow: row nowrap;
  }
  .motto {
    text-align: center;
    flex: 1 0 auto;
    font-size: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10%;
  }
  .motto.text-primary-emphasis {
    font-weight: bold;
  }

  .question {
    max-width: 1200px;
    flex: 0 auto;
    margin: 0 auto;
  }
  .fake-input {
    border-color: rgba(64, 56, 48, 0.4) !important;
    font-weight: bold;
  }
</style>
