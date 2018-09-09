<template>
  <v-layout fluid fill-height>
    <info-box :ref="infoBox" :aniData="aniData" @refresh="refreshAniList" />

    <transition name="fade" mode="out-in">
      <slot/>
    </transition>
  </v-layout>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex';
import EventBus from '@/plugins/eventBus';
import MainMenu from '@/components/AniList/Menu';
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
    ...mapActions('aniList', ['detectAndSetAniData']),
    ...mapMutations(['setReady']),
    openSettings() {
      this.$refs[this.event].show();
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
