<script>
  import { onMount } from "svelte";
  import { poll } from "$lib/utils/poll.js";
  import { settings } from "$lib/utils/stores.js";

  import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
  Chart.register(PieController, ArcElement, Tooltip, Legend);

  import ChartSpoilerCover from "../elements/ChartSpoilerCover.svelte";

  let canvas = null, chart = null;
  $: if (chart) {
    const entries = Array.from($poll.entries.values());
    chart.data.labels = entries.map(e => `[${e.id}] ${e.text}`);
    chart.data.datasets[0].data = entries.map(e => e.score);
    chart.data.datasets[0].backgroundColor = entries.map(e => e.bgcolor);
    chart.data.datasets[0].borderColor = entries.map(e => e.bordercolor);
    chart.update();
  }

  onMount(() => {
    chart = new Chart(canvas, {
      type: "pie",
      options: {
        animation: {
          duration: 200,
          easing: 'easeInCubic',
          delay: 0,
          loop: false
        },
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true
          }
        }
      },
      data: {
        labels: [],
        datasets: [
          {
            label: 'Votes',
            data: [],
            backgroundColor: [],
            borderWidth: 2,
            borderColor: [],
          },
        ],
      }
    });
    return () => {
      chart?.destroy();
    };
  })
</script>

<style>
  .main {
    width: 100%;
    height: 100%;
    position: relative;
  }
  canvas {
    width: 100%;
    height: 100%;
  }
  .spoiler {
    filter: blur(4px);
  }
</style>

<!--content-->
<div class="main">
  <canvas bind:this={canvas} class:spoiler={$settings.hideVotes}></canvas>
  {#if $settings.hideVotes}
  <ChartSpoilerCover />
  {/if}
</div>