<script lang="ts">
  import { Card, FlexLayout, Logo, QRCode as QR } from "@scx/ui-core";

  export let QRCode = false;
  export let values = {
    name: "",
    organization: "",
    jobTitle: "",
    phone: "",
    address: "",
    email: "",
    photoURL: "",
    logoURL: "",
    backgroundURL: "",
  };

  const bgColor = `linear-gradient(to bottom right, rgba(16, 24, 26, ${
    values.backgroundURL === "" ? 1 : 0.8
  }),rgba(33, 87, 145, ${values.backgroundURL === "" ? 1 : 0.8}))`;
  const bgImage = `url(${values.backgroundURL})`;
</script>

<style>
  :global(section) {
    background: var(--bg-color), var(--bg-image);
  }
  h1 {
    color: rgb(61, 154, 253);
    text-transform: uppercase;
  }
  h2 {
    color: rgb(61, 154, 253);
  }
  :global(#photo) {
    border-radius: 50%;
    border: 2px solid rgb(61, 154, 253);
  }
</style>

<div style="--bg-color:{bgColor}; --bg-image: {bgImage}">
  <Card>
    <FlexLayout justify="space-between" align="start">
      <FlexLayout direction="column">
        <Logo id="photo" imgSrc={values.photoURL} imgAlt="avatar" />
        <h1>{values.name}</h1>
        <h3>{values.jobTitle}</h3>
        <FlexLayout>
          <Logo
            imgSrc="https://icongr.am/entypo/old-phone.svg?size=20&color=ffffff"
            imgAlt="phone" />
          <span>{values.phone}</span>
        </FlexLayout>
        <FlexLayout>
          <Logo
            imgSrc={`${values.address.length > 0 ? 'https://icongr.am/entypo/address.svg?size=20&color=ffffff' : ''}`}
            imgAlt="address" />
          <span>{values.address}</span>
        </FlexLayout>
        <FlexLayout>
          <Logo
            imgSrc="https://icongr.am/entypo/email.svg?size=20&color=ffffff"
            alt="email" />
          <span>{values.email}</span>
        </FlexLayout>
      </FlexLayout>

      <FlexLayout direction="column" align="end">
        <FlexLayout align="center">
          <Logo imgSrc={values.logoURL} alt="email" />
          <h2>{values.organization}</h2>
        </FlexLayout>
        {#if QRCode}
          <QR {values} />
        {/if}
      </FlexLayout>
    </FlexLayout>
  </Card>
</div>
