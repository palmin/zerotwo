<template>
  <div class="ui fullscreen modal">
    <div class="header">{{ header }}</div>
    <div class="content">
      <div class="ui basic segment" v-html="description"></div>
    </div>
    <div class="actions">
      <div class="ui button" @click="close">{{ $t('close') }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  computed: {
    header() {
      return this.data.title;
    },

    description() {
      return this.data.synopsis;
    },
  },

  methods: {
    close() {
      $(this.$el).modal('hide');
    },
    show() {
      $(this.$el)
        .modal({
          closable: false,
          centered: false,
        })
        .modal('show');
    },
  },
};
</script>

<i18n>
{
  "de": {
    "close": "Schließen"
  }
}
</i18n>
