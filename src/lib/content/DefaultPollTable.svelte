<script>
  import SvelteTable from "svelte-table";
  import DefaultPollAddEntry from "../elements/AddEntryBlock.svelte";
  import UserProfileLinkRenderer from "../elements/UserProfileLinkRenderer.svelte";

  import { poll } from "$lib/utils/poll.js";

  const iconAsc =
    "<span class='ml-auto mr-1 material-icons fs-5' style='opacity:0.8'>&#xe316;</span>";
  const iconDesc =
    "<span class='ml-auto mr-1 material-icons fs-5' style='opacity:0.8'>&#xe313;</span>";
  const iconExpand = `<button class="btn btn-danger p-1" onclick="" title="Remove suggestion">
      <span class="material-icons p-0">&#xe92b;</span>
  </button>`;

  let data = [];
  $: {
    data = Array.from($poll.entries.values());
  }

  const columns = [
    {
      key: "id",
      title: "Command",
      value: (v) => v.id,
      sortable: true,
      renderValue: (v) => "!vote " + v.id,
    },
    {
      key: "renderText",
      title: "Option",
      value: (v) => v.renderText,
      sortable: true,
      headerClass: "w-50",
    },
    {
      key: "renderName",
      title: "Author",
      value: (v) => v.username,
      renderComponent: UserProfileLinkRenderer,
      class: "no-decoration",
      sortable: true,
    },
    {
      key: "renderScore",
      title: "Score",
      value: (v) => v.renderScore,
      sortable: true,
    },
  ];

  function clickDeleteButton(event) {
    const targetToDelete = event.detail?.row;
    if (!targetToDelete) return;

    $poll.removeEntryById(targetToDelete.id);
  }
</script>

<div class="table-outer">
  <DefaultPollAddEntry />

  {#key data}
    <SvelteTable
      {columns}
      rows={data}
      sortBy="id"
      rowKey="id"
      classNameTable="table table-dark table-hover"
      classNameThead="text-warning"
      classNameTbody="table-group-divider divider-donk"
      classNameExpandedContent="unpadded-content"
      showExpandIcon={true}
      expandSingle={true}
      {iconAsc}
      {iconDesc}
      {iconExpand}
      iconExpanded={iconExpand}
      on:clickExpand={clickDeleteButton}
    >
      <svelte:fragment slot="expanded" let:row><!--nothing here--></svelte:fragment>
    </SvelteTable>
  {/key}

  {#if data.length < 1}
    <div class="w-100 text-center fs-3 opacity-50 user-select-none">
      <img src="./img/donkchat.gif" alt="DonkChat" width="36" height="36" />
      The poll is empty
    </div>
  {/if}
</div>

<style>
  .table-outer {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
