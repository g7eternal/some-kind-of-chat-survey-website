<script>
  import { browser } from "$app/environment";
  import { TabContent, TabPane } from "sveltestrap";
  import DefaultPollChart from "./DefaultPollChart.svelte";
  import DefaultPollPie from "./DefaultPollPie.svelte";
  import DefaultPollTable from "./DefaultPollTable.svelte";

  let showCaptions = false;
  function toggleCaptions() {
    showCaptions = window.innerWidth > window.innerHeight && window.innerWidth > 800;
  }
  if (browser) toggleCaptions();
</script>

<svelte:window on:resize={toggleCaptions} />
<!-- content -->
<TabContent>
  {#if showCaptions}
    <TabPane tabId="caption" disabled>
      <span slot="tab"> View mode: </span>
    </TabPane>
  {/if}

  <TabPane tabId="dataTable" active>
    <span slot="tab" class="text-success-emphasis">
      <span class="material-icons">&#xe241;</span>
      {#if showCaptions}
        Table
      {/if}
    </span>

    <DefaultPollTable />
  </TabPane>
  <TabPane tabId="dataChart">
    <span slot="tab" class="text-success-emphasis">
      <span class="material-icons">&#xf20c;</span>
      {#if showCaptions}
        Graph
      {/if}
    </span>

    <DefaultPollChart />
  </TabPane>

  <TabPane tabId="dataPieChart">
    <span slot="tab" class="text-success-emphasis">
      <span class="material-icons">&#xe1af;</span>
      {#if showCaptions}
        Chart
      {/if}
    </span>

    <DefaultPollPie />
  </TabPane>
</TabContent>
