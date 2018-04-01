<template>
  <div class="ui fluid container">
    <div class="ui dimmer" :class="{ active: !isReady }">
      <div class="ui text loader">
        {{ $t('loading') }}
      </div>
    </div>
    <main-menu :openSettings="openSettings" :refreshMAL="refreshMAL" :openInformation="openInformation" />
    <settings :ref="event" />
    <info-box :ref="infoBox" :data="infoData" @refresh="detectAndSetMALData" />
    <transition name="fade" mode="out-in">
      <slot/>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
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
    ...mapState(['isReady']),
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
    ...mapMutations(['setReady']),
    openSettings() {
      this.$refs[this.event].show();
    },
    async refreshMAL() {
      await this.setReady(false);
      await this.detectAndSetMALData();
      await this.setReady(true);
    },
    openInformation(name) {
      this.setReady(false);
      this.$http.findAnime(name, this.auth)
        .then((data) => {
          if (data !== null) {
            this.infoData = data;
            this.$refs[this.infoBox].show();
          }
        })
        .finally(() => {
          this.setReady(true);
        });
    },
  },
  name: 'app',
  data() {
    return {
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
  },
  "ja": {
    "loading": "通信中・・・"
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
