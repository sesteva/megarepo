<script>
  export let imgSrc;
  export let imgAlt;
  export let id;
</script>

<style>
  picture {
    margin: 0.5rem 0.5rem 0.5rem 0;
    position: relative;
    top: 5px;
  }
</style>

{#if imgSrc && imgSrc.length > 0}
  <picture>
    <img src={imgSrc} alt={imgAlt} {id} />
  </picture>
{/if}
