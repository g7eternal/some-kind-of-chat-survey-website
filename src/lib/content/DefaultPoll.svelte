<script>
  import { TabContent, TabPane } from 'sveltestrap';
	import DefaultPollChart from "./DefaultPollChart.svelte";
	import DefaultPollPie from "./DefaultPollPie.svelte";
	import DefaultPollTable from "./DefaultPollTable.svelte";
</script>

<style>
  
</style>

<!-- content -->
<TabContent>
  <TabPane tabId="dataTable" active>
    <span slot="tab" class="text-success-emphasis">
      <span class='material-icons'>&#xe241;</span> Table
    </span>

    <DefaultPollTable />
  </TabPane>
  <TabPane tabId="dataChart" tab="">
    <span slot="tab" class="text-success-emphasis">
      <span class='material-icons'>&#xf20c;</span> Graph
    </span>

    <DefaultPollChart />
  </TabPane>

  <TabPane tabId="dataPieChart" tab="">
    <span slot="tab" class="text-success-emphasis">
      <span class='material-icons'>&#xe1af;</span> Chart
    </span>

    <DefaultPollPie />
  </TabPane>
</TabContent>
