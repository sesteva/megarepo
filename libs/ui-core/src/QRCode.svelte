<script>
  export let values;
  $: qrString = `BEGIN:VCARD
      VERSION:4.0
      N:${values.name};${values.name};;;
      FN:${values.name}
      ORG:${values.organization}
      TITLE:${values.jobTitle}
      TEL;TYPE=work;VALUE=uri:${values.phone}
      ADR;TYPE=WORK;PREF=1;LABEL="${values.address}":;;${values.address}
      EMAIL;TYPE=WORK:${values.email}
      REV:20080424T195243Z
      x-qq:21588891
      END:VCARD`;
  $: imgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURI(
    qrString
  )}`;
</script>

<style>
  picture {
    margin-top: 5rem;
  }
</style>

<picture>
  <img src={imgSrc} alt="qrcode" />
</picture>
