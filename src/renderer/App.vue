<template>
  <div id="app">
    <div class="layout" :is="layout">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DefaultLayout from '@/layouts/Default';

export default {
  name: 'app',

  created() {
    this.setLocale(this.$electron.remote.app.getLocale());
  },

  data() {
    return {
      layout: DefaultLayout,
    };
  },

  computed: {
    ...mapState('i18n', ['locale']),
  },

  watch: {
    $route(route) {
      if (route.meta.layout) {
        this.setLayout(route.meta.layout);
      }
    },
    locale(locale) {
      this.$i18n.locale = locale;
    },
  },

  methods: {
    setLayout(layout) {
      this.layout = layout || DefaultLayout;
    },
    setLocale(locale) {
      this.$i18n.locale = locale || 'en';
    },
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
