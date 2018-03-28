<template>
  <div class="ui selection dropdown">
    <input type="hidden" name="gender">
    <i class="dropdown icon"></i>
    <div class="default text"></div>
    <div class="menu"></div>
  </div>
</template>

<script>
export default {
  props: {
    // Text to display when nothing is selected.
    placeholder: {
      type: String,
      required: true,
    },
    // Value of the component to bind a model to.
    value: {},
    // Items to populate select options from.
    items: {
      type: Array,
      default: () => [],
    },
    // Async items to populate select options from. Must return a promise.
    asyncItems: {
      type: Function,
    },
    // Item field to use a an option label
    displayField: {
      type: String,
      default: 'name',
    },
    // Item field to use as an option value
    valueField: {
      type: String,
      default: 'value',
    },
  },

  watch: {
    items(items) {
      this.changeValues(items);
      this.setSelected(this.value);
    },
    value(value) {
      this.setSelected(value);
    },
  },

  mounted() {
    this.init();
    this.setSelected(this.value);
    this.loadData();
  },

  beforeDestroy() {
    this.deinit();
  },

  methods: {
    loadData() {
      if (!this.asyncItems) return;

      this.setLoading();
      this
        .asyncItems()
        .then((items) => {
          this.changeValues(items);
          this.setSelected(this.value);
        })
        .finally(() => this.removeLoading());
    },
    parseData(items) {
      return items.map(item => ({
        value: item[this.valueField],
        name: item[this.displayField],
      }));
    },
    init() {
      const values = this.parseData(this.items);

      $(this.$el).dropdown({
        values,
        placeholder: this.placeholder,
        onChange: (value) => {
          this.$emit('input', value);
          this.$emit('change', value);
        },
      });
    },
    deinit() {
      $(this.$el).dropdown('destroy');
    },
    setSelected(value) {
      if (!this.$el) return;
      $(this.$el).dropdown('set selected', value);
    },
    changeValues(items) {
      if (!this.$el) return;
      $(this.$el).dropdown('change values', this.parseData(items));
    },
    setLoading() {
      if (!this.$el) return;
      $(this.$el).dropdown('set loading');
    },
    removeLoading() {
      if (!this.$el) return;
      $(this.$el).dropdown('remove loading');
    },
  },
};
</script>

<i18n>
{
  "en": {
    "pleaseSelect": "Please select..."
  },
  "de": {
    "pleaseSelect": "Bitte wählen..."
  }
}
</i18n>
