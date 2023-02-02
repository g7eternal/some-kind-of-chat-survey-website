<script>
  import { settings } from "../utils/stores";
  import { yesNoPoll as poll } from "$lib/utils/yes_no.js";
  import SpoilerBlock from "../elements/SpoilerBlock.svelte";
  import YesNoFloater from "../elements/YesNoFloater.svelte";

  const motto = `Type YES or NO in chat to vote`;
  let question = "";

  let yesScale=1, noScale=1, yesScore=0, noScore=0;
  $: {
    yesScore = $poll.entries.get("YEA")?.score || 0;
    noScore = $poll.entries.get("NAY")?.score || 0;

    yesScale = Math.min(2, Math.max(0.5, (1 + yesScore)/(1 + noScore)));
    noScale = 1/yesScale;
  }
</script>

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
    min-height: 350px;
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
  }
  .motto {
    text-align: center;
    flex: 1 0 auto;
    font-size: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
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

<!-- content -->

<div class="outer">

  <div class="input-group my-2 px-1 question">
    <input type="text" class="form-control fs-2 text-center border-warning-subtle" 
      bind:value={question} class:fake-input={question.length > 0}
      placeholder="What are we voting for?">
  </div>

  <SpoilerBlock blur={false} hide={$settings.hideVotes}>
    <div class="variants">
      <YesNoFloater text={"YEA"} 
        count={yesScore} scale={yesScale} />
      <YesNoFloater text={"NAY"} 
        count={noScore} scale={noScale} />
    </div>
  </SpoilerBlock>

  <div class="motto" class:text-primary-emphasis={$poll.allowVote}>
    {$poll.allowVote ? motto : "Awaiting for the vote to start"}
  </div>

</div>