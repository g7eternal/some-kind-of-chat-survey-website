<script>
  import { settings } from "../utils/stores";
  import { yesNoPoll as poll } from "$lib/utils/yes_no.js";
	import ChartSpoilerCover from "../elements/ChartSpoilerCover.svelte";
	import YesNoFloater from "../elements/YesNoFloater.svelte";

  const motto = `Type YES or NO in chat to vote`;

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
    margin: 0 auto;
    display: flex;
    flex-flow: column nowrap;
  }
  .variants {
    flex: 1 0 auto;
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
  }
  .motto {
    text-align: center;
    height: 20%;
    font-size: 2em;
  }
  .motto.text-primary-emphasis {
    font-weight: bold;
  }
</style>

<!-- content -->
<div class="outer">

  <div class="variants">
    <YesNoFloater text={"YEA"} 
      count={yesScore} scale={yesScale} />
    <YesNoFloater text={"NAY"} 
      count={noScore} scale={noScale} />
  </div>
  <div class="motto" class:text-primary-emphasis={$poll.allowVote}>
    {$poll.allowVote ? motto : "Awaiting for the vote to start"}
  </div>

  {#if $settings.hideVotes}
    <ChartSpoilerCover spoilerCaption="" />
  {/if}
</div>