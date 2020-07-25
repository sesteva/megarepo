<script>
  export let big = false;
  export let ghost = false;
  export let onClick = () => {};
  export let disabled = false;

  $: console.log("button", disabled);
</script>

<style>
  .big {
    font-size: 20px;
    display: block;
    width: 100%;
  }

  .ghost {
    background-color: transparent;
    border: solid currentColor 2px;
  }
</style>

<!-- Use $$restProps for resuable comps e.g aria atttributes we forgot  -->
<button
  class:big
  class:ghost
  on:click|preventDefault={onClick}
  {disabled}
  {...$$restProps}>
  <slot>pass a slot</slot>
</button>
