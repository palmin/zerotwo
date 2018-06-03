<template>
  <div class="ui fluid container">
    <div class="ui dimmer" :class="{ active: !isReady }">
      <div class="ui text loader">
        {{ $t('loading') }}
      </div>
    </div>

    <main-menu
    :openSettings="openSettings"
    :refreshMAL="refreshMAL"
    :refreshAniList="refreshAniList"
    :openInformation="openInformation" />

    <settings :ref="event" />
    <info-box :ref="infoBox" :aniData="aniData"
    @refresh="refreshAniList"
    />
    <transition name="fade" mode="out-in">
      <slot/>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import EventBus from '@/plugins/eventBus';
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
    // ...mapState('myAnimeList', ['malData', 'auth', 'information']),
    ...mapState('aniList', ['aniData', 'session']),
  },

  mounted() {
    EventBus.$on('setOpenInformationId', (value) => {
      EventBus.informationId = value;

      if (value !== null) {
        this.openInformation(value);
      }
    });
    EventBus.$on('setInformation', (value) => {
      EventBus.information = value;

      if (value !== null) {
        this.$refs[this.infoBox].show(value);
      }
    });
  },
  methods: {
    // ...mapActions('myAnimeList', ['detectAndSetMALData']),
    ...mapActions('aniList', ['detectAndSetAniData']),
    ...mapMutations(['setReady']),
    openSettings() {
      this.$refs[this.event].show();
    },
    async refreshMAL() {
      await this.setReady(false);
      // await this.detectAndSetMALData();
      await this.setReady(true);
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
        this.$notify({
          type: 'error',
          title: 'ERROR',
          text: error,
        });
      }

      await this.setReady(true);
    },
  },
  name: 'app',
  data() {
    return {
      event: 'showSettings',
      infoBox: 'infoBox',
      infoData: null,
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
