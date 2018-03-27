<template>
  <div class="ui fluid container">
    <div class="ui dimmer" :class="{ active: loading }">
      <div class="ui text loader">
        {{ $t('loading') }}
      </div>
    </div>
    <main-menu :openSettings="openSettings" :refreshMAL="refreshMAL" :malData="malData" :openInformation="openInformation" />
    <settings :ref="event" />
    <info-box :ref="infoBox" :data="infoData" />
    <transition name="fade" mode="out-in">
      <slot/>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MainMenu from '@/components/Menu';
import Settings from '@/components/Settings';
import InfoBox from '@/components/InformationModal';

export default {
  components: {
    MainMenu,
    Settings,
    InfoBox,
  },
  computed: {
    ...mapState('myAnimeList', ['malData', 'auth', 'information']),
  },
  watch: {
    information(name) {
      if (!name) {
        return;
      }

      this.openInformation(name);
    },
  },
  methods: {
    ...mapActions('myAnimeList', ['detectAndSetMALData']),
    openSettings() {
      this.$refs[this.event].show();
    },
    refreshMAL() {
      this.detectAndSetMALData();
    },
    openInformation(name) {
      this.loading = true;
      this.$http.findAnime(name, this.auth)
        .then((data) => {
          if (data !== null) {
            this.infoData = data;
            this.$refs[this.infoBox].show();
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  name: 'app',
  data() {
    return {
      loading: false,
      event: 'showSettings',
      infoBox: 'infoBox',
      infoData: {
        title: '',
        synopsis: '',
      },
    };
  },
};
</script>

<i18n>
{
  "en": {
    "loading": "Loading..."
  },
  "de": {
    "loading": "Lädt..."
  }
}
</i18n>

<style scoped>
.ui.dimmer {
  position: fixed !important;
}
</style>


<style>
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity .25s;
}

.fade-leave-active {
  transition: opacity .25s;
  opacity: 0;
}
</style>
