<script>
  import DefaultButton from "./Button.svelte";
</script>

<style>
  .twitter :global(button) {
    background-color: #1da1f2;
  }
</style>

<!-- Use $$restProps for resuable comps e.g aria atttributes we forgot or to avoid re exporting all those in the core comp  -->
<!-- one disadvantage is not exposing propert type -->
<span class="twitter">
  <DefaultButton
    onClick={() => alert('I am going to Twitter')}
    {...$$restProps}>
    <svg
      height="10"
      viewBox="328 355 335 276"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M630 425a195 195 0 01-299 175 142 142 0 0097-30 70 70 0 01-58-47 70
        70 0 0031-2 70 70 0 01-57-66 70 70 0 0028 5 70 70 0 01-18-90 195 195 0
        00141 72 67 67 0 01116-62 117 117 0 0043-17 65 65 0 01-31 38 117 117 0
        0039-11 65 65 0 01-32 35z"
        fill="#fff" />
    </svg>
    Twitter
  </DefaultButton>
</span>
