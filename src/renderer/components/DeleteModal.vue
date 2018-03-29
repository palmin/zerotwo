<template>
  <div class="ui basic modal">
    <div class="ui icon header">
      <i class="trash icon"></i>
      {{ header }}
    </div>
    <div class="scrolling content">
      {{ content }}
    </div>
    <div class="actions">
      <div class="ui secondary button" @click="cancelHandler">{{ cancelText }}</div>
      <div class="ui red button" @click="submitHandler">{{ submitText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      required: true,
      type: String,
    },
    content: {
      required: true,
      type: String,
    },
    cancelButtonText: {
      required: false,
      type: String,
      default: null,
    },
    submitButtonText: {
      required: false,
      type: String,
      default: null,
    },
    cancelHandler: {
      required: false,
      type: Function,
    },
    submitHandler: {
      required: true,
      type: Function,
    },
  },
  computed: {
    cancelText() {
      return !this.cancelButtonText ? this.$t('cancel') : this.cancelButtonText;
    },
    submitText() {
      return !this.submitButtonText ? this.$t('submit') : this.submitButtonText;
    },
  },
  methods: {
    show() {
      $(this.$el)
        .modal({
          closable: false,
          centered: false,
          autofocus: false,
        })
        .modal('show');
    },
    hide() {
      $(this.$el)
        .modal('hide');
    },
  },
};
</script>

<i18n>
{
  "en": {
    "cancel": "Cancel",
    "submit": "Delete"
  },
  "de": {
    "cancel": "Abbrechen",
    "submit": "Löschen"
  },
  "ja": {
    "cancel": "キャンセル",
    "submit": "削除"
  }
}
</i18n>
