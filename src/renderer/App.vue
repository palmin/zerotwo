<template>
  <div id="app">
    <notification />
    <div class="layout" :is="layout">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DefaultLayout from '@/layouts/Default';
import Notification from '@/components/Notification';
import malTimer from '@/mixins/malTimer';

export default {
  name: 'app',
  mixins: [malTimer],
  components: { Notification },

  created() {
    if (!this.locale) {
      this.setLocale(this.$electron.remote.app.getLocale());
    }
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
    ...mapMutations(['setReady']),
    setLayout(layout) {
      this.layout = layout || DefaultLayout;
    },
    setLocale(locale) {
      this.$i18n.locale = locale || 'en';
    },
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
