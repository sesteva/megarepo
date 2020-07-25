<script lang="ts">
  import { Navbar } from "@scx/ui-core";
  export let title;
</script>

<style>
  main {
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }
</style>

<Navbar {title} />

<main>
  <slot />
</main>
