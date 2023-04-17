<script>
  import UserProfileLink from "./UserProfileLink.svelte";

  export let row, col;
</script>

{#if row.username.includes("~")}
  {@html row.renderName}
{:else}
  <UserProfileLink user={row.username}>
    {@html row.renderName}
  </UserProfileLink>
{/if}
