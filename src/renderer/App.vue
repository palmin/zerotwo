<template>
  <v-app dark id="app">
    <notification />
    <main-menu
      :refreshAniList="refreshAniList"
      :openInformation="openInformation" />
    <main>
      <v-content :is="layout">
        <router-view />
      </v-content>
    </main>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import AniListLayout from '@/layouts/AniList';
import MainMenu from '@/components/AniList/Menu';
import Notification from '@/components/Notification';
// import malTimer from '@/mixins/malTimer';
// import discord from '@/mixins/discord';
import aniListTimer from '@/mixins/aniListTimer';
import EventBus from '@/plugins/eventBus';

export default {
  name: 'app',
  mixins: [
    // malTimer,
    // discord,
    aniListTimer,
  ],
  components: { Notification, MainMenu },

  created() {
    if (!this.locale) {
      this.setLocale(this.$electron.remote.app.getLocale());
    }
  },

  data() {
    return {
      layout: AniListLayout,
      infoBox: 'infoBox',
    };
  },

  computed: { ...mapState('i18n', ['locale']) },

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
    ...mapActions('aniList', ['detectAndSetAniData']),
    ...mapMutations(['setReady']),
    setLayout(layout) {
      this.layout = layout || AniListLayout;
    },
    setLocale(locale) {
      this.$i18n.locale = locale || 'en';
    },
    async refreshAniList() {
      await this.setReady(false);
      await this.detectAndSetAniData();
      await this.setReady(true);
    },
    async openInformation(mediaId) {
      await this.setReady(false);

      try {
        const accessToken = this.session.access_token;
        const data = await this.$http.openAnimeInformation(mediaId, accessToken);
        EventBus.$emit('setInformation', data);
        this.$refs[this.infoBox].show();
      } catch (error) {
        const { status, message } = error.response.data.errors[0];
        if (status === 404) {
          this.$notify({
            type: 'err',
            title: this.$t('system.error.titles.notFound'),
            text: this.$t('system.error.messages.notFoundOrAdultContent'),
            duration: -1,
          });
        } else {
          this.$notify({
            type: 'err',
            title: this.$t('system.error.titles.fatalError'),
            text: message,
            duration: -1,
          });
        }
      }

      await this.setReady(true);
    },
  },
};
</script>

<style lang="scss">
@import "assets/override";
@import "assets/extra";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
