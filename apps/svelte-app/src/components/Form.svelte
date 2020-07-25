<script>
  import { createEventDispatcher } from "svelte";
  import { TextInput } from "@scx/ui-core";
  const dispatch = createEventDispatcher();

  const defaultValues = {
    name: "",
    organization: "",
    jobTitle: "",
    phone: "",
    address: "",
    email: "",
    photoURL: "https://i.pravatar.cc/100?img=68",
    logoURL: "https://icongr.am/entypo/database.svg?size=40&color=3d9afd",
    backgroundURL:
      "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
  };

  export let values = { ...defaultValues };

  let disabled = true;
  let firstInputRef;

  const inputsData = [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "Your contact name",
    },
    {
      id: "organization",
      label: "Organisation",
      type: "text",
      placeholder: "Name of your organization",
    },
    {
      id: "jobTitle",
      label: "Job Title",
      type: "text",
      placeholder: "Your job title",
    },
    {
      id: "phone",
      label: "Phone number",
      type: "text",
      placeholder: "Your phone number",
    },
    {
      id: "address",
      label: "Address",
      type: "text",
      placeholder: "Professional address",
    },
    {
      id: "email",
      label: "E-Mail",
      type: "email",
      placeholder: "Professional E-Mail address",
    },
    {
      id: "photoURL",
      label: "Photo",
      type: "text",
      placeholder: "URL of personal portrait",
    },
    {
      id: "logoURL",
      label: "Company logo",
      type: "text",
      placeholder: "URL of your company's logo",
    },
    {
      id: "backgroundURL",
      label: "Background image",
      type: "text",
      placeholder: "URL of card's background (leave blank for none)",
    },
  ];

  function resetClicked() {
    disabled = true;
    values = { ...defaultValues };
    firstInput.focus();
  }

  function keyPressed(event) {
    event.key === "Shift" ? "" : (disabled = false);
    dispatch("createQRCode", false);
  }
</script>

<style>
  article {
    display: flex;
    justify-content: space-evenly;
  }
  button {
    margin: 0.5rem 0;
    cursor: pointer;
    border-radius: 5px;
  }
  form :global(label) {
    display: flex;
    align-items: baseline;
    margin: 0.5rem;
    font-weight: bold;
  }
  form :global(input) {
    width: 70%;
    margin: 0 0.5rem;
    border-radius: 5px;
  }
  form :global(.labelText) {
    text-align: end;
    width: 30%;
  }
  form :global(input:focus) {
    border-color: hsl(211, 63%, 35%);
    box-shadow: 0 1px 3px hsla(211, 63%, 35%, 0.4);
  }
</style>

<form>
  {#each inputsData as input, i}
    {#if i === 0}
      <TextInput
        {...input}
        on:keydown={keyPressed}
        bind:value={values[input.id]}
        bind:this={firstInputRef} />
    {:else}
      <TextInput
        {...input}
        on:keydown={keyPressed}
        bind:value={values[input.id]} />
    {/if}
  {/each}

  <article>
    <button {disabled} on:click|preventDefault={resetClicked}>Reset</button>
    <button
      on:click|preventDefault={() => {
        dispatch('createQRCode', true);
      }}>
      Create QR Code
    </button>
  </article>
</form>
