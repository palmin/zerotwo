<template>
  <div>
    {{ $t('hello') }}
  </div>
</template>

<script>
export default {
  mounted() {
  },
};
</script>

<i18n>
{
  "en": {
    "hello": "Hello"
  },
  "de": {
    "hello": "Hallo"
  }
}
</i18n>
