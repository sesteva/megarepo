<script>
  export let title = "Default Title";
  let paddingInRem = 1;
</script>

<style>
  nav {
    width: 100%;
    font-size: 2rem;
    padding: var(--padding);
    background-color: #333;
    color: #fff;
    text-align: center;
  }
</style>

<nav style="--padding:{paddingInRem}rem">{title}</nav>
