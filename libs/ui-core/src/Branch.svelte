<script lang="ts">
  export let test: Boolean = false;
  export let left;
  export let right;
  let LeftComponent = left.component;
  let RightComponent = right.component;
</script>

{#if test}
  <LeftComponent props={left.props}>{left.slot}</LeftComponent>
{:else}
  <RightComponent {...right.props}>{right.slot}</RightComponent>
{/if}
