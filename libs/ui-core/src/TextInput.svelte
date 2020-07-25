<script>
  export let label;
  export let placeholder;
  export let type;
  export let value = "";
</script>

<label>
  <div class="labelText">{label}</div>
  <input
    {type}
    {placeholder}
    {value}
    on:keydown
    on:change
    on:input
    on:focus
    on:blur
    on:input={({ target }) => {
      value = target.value;
    }} />

</label>
