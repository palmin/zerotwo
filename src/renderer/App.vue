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
import LoginLayout from '@/layouts/Login';
import Notification from '@/components/Notification';
import malTimer from '@/mixins/malTimer';

export default {
  name: 'app',
  mixins: [malTimer],
  components: { Notification },

  created() {
    this.setLocale(this.$electron.remote.app.getLocale());
    if (!this.auth) {
      this.setLayout(LoginLayout);
    }
  },

  data() {
    return {
      layout: DefaultLayout,
    };
  },

  computed: {
    ...mapState('i18n', ['locale']),
    ...mapState('myAnimeList', ['auth']),
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
    auth(auth) {
      if (!auth) {
        this.setLayout(LoginLayout);
      } else {
        this.setLayout(DefaultLayout);
      }
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
