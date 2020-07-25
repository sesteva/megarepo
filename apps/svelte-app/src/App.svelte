<script lang="ts">
  import Layout from "./components/Layout.svelte";
  import Form from "./components/Form.svelte";
  import VCard from "./components/VCard.svelte";
  let QRCode = false;
  let values;
</script>

<Layout title="vCard Generator">
  <Form on:createQRCode={(e) => (QRCode = e.detail)} bind:values />
  <VCard {QRCode} {values} />
</Layout>
