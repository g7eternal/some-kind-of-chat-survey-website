<script>
  import { onMount } from "svelte";
  import { settings } from "$lib/utils/stores.js";
  import { poll } from "$lib/utils/poll.js";

  import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);
  
  import ChartSpoilerCover from "../elements/ChartSpoilerCover.svelte";

  let canvas = null, chart = null;
  $: if (chart) {
    const entries = Array.from($poll.entries.values()).sort((a,b) => (b.score - a.score));
    chart.data.labels = entries.map(e => [`${$settings.voteCommand} ${e.id}`, e.text]);
    chart.data.datasets[0].data = entries.map(e => e.score);
    chart.data.datasets[0].backgroundColor = entries.map(e => e.bgcolor);
    chart.data.datasets[0].borderColor = entries.map(e => e.bordercolor);
    chart.update();
  }

  onMount(() => {
    chart = new Chart(canvas, {
      type: "bar",
      options: {
        animation: {
          duration: 200,
          easing: 'easeInCubic',
          delay: 0,
          loop: false
        },
        indexAxis: 'y',
        scales: {
          x: {
            axis: 'x',
            ticks: {
              color: "white",
            },
            beginAtZero: true,
          },
          y: {
            axis: 'y',
            ticks: {
              textStrokeColor: "rgba(0,0,0,1)",
              textStrokeWidth: 3,
              font: () => ({
                size: Math.round(18*window.innerHeight/1000)
              }),
              color: "white",
              mirror: true,
              z: 1,
            },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
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
    max-width: 100%;
    max-height: 100%;
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