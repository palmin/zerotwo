<template>
  <v-toolbar app fixed dark flat dense>
    <v-menu offset-y>
      <v-btn flat dark slot="activator">
        <v-icon left>fas fa-bars</v-icon>
        {{ $t(`system.modules.${currentModule}`) }}
      </v-btn>
      <v-list>
        <v-list-tile @click="navigateTo(modules.aniList)" :disabled="currentModule !== 'aniList'">
          <v-list-tile-title>{{ $t('system.modules.aniList') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="navigateTo(modules.myAnimeList)" :disabled="currentModule !== 'myAnimeList'">
          <v-list-tile-title>{{ $t('system.modules.myAnimeList') }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="navigateTo(modules.torrents)" :disabled="currentModule !== 'torrents'">
          <v-list-tile-title>{{ $t('system.modules.torrents') }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <!-- <v-btn flat exact :to="{ name: 'Ani-Home' }">
        <v-icon left>fas fa-home</v-icon>
        {{ $t('system.menu.listStatus.home') }}
      </v-btn> -->

      <v-btn flat exact :to="{ name: 'Ani-Watching' }">
        <v-icon color="green" left>fas fa-stop</v-icon>
        {{ $t('system.menu.listStatus.watching', { amount: watchingAmount }) }}
      </v-btn>

      <v-btn flat exact :to="{ name: 'Ani-Completed' }">
        <v-icon color="blue" left>fas fa-stop</v-icon>
        {{ $t('system.menu.listStatus.completed', { amount: completedAmount }) }}
      </v-btn>

      <v-btn flat exact :to="{ name: 'Ani-Paused' }">
        <v-icon color="yellow" left>fas fa-stop</v-icon>
        {{ $t('system.menu.listStatus.onHold', { amount: pausedAmount }) }}
      </v-btn>

      <v-btn flat exact :to="{ name: 'Ani-Dropped' }">
        <v-icon color="red" left>fas fa-stop</v-icon>
        {{ $t('system.menu.listStatus.dropped', { amount: droppedAmount }) }}
      </v-btn>

      <v-btn flat exact :to="{ name: 'Ani-Planning' }">
        <v-icon color="black" left>fas fa-stop</v-icon>
        {{ $t('system.menu.listStatus.planned', { amount: planningAmount }) }}
      </v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <search-box :disabled="!isAuthenticated" @openInformation="openInformationWindow" />

    <v-tooltip bottom>
      <v-progress-circular :rotate="-90" :value="refreshTimePercentage" :color="progressCircleColor" :indeterminate="!isReady" size="32" :width="2" slot="activator">
        <v-icon size="14" style="vertical-align: baseline;" :disabled="!this.isAuthenticated" @click="refreshAniList">fas fa-sync {{ !isReady ? 'fa-spin' : '' }}</v-icon>
      </v-progress-circular>
      <span>{{ readableTimeUntilNextRefresh }}</span>
    </v-tooltip>

    <settings />
  </v-toolbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SearchBox from '../SearchBox';
import Settings from '../Settings';

export default {
  props: ['refreshAniList', 'openInformation'],
  components: { SearchBox, Settings },
  computed: {
    ...mapState(['isReady', 'currentModule', 'modules']),
    ...mapState('aniList', ['timeUntilNextRefresh', 'refreshRate', 'aniData']),
    ...mapGetters('aniList', ['isAuthenticated']),
    refreshTimePercentage() {
      if (!this.refreshRate) {
        return 100;
      }

      const refreshRateInMilliseconds = this.refreshRate * 60000;

      return Math.floor((100 / refreshRateInMilliseconds) * this.timeUntilNextRefresh);
    },
    progressCircleColor() {
      if (!this.isReady) {
        return 'info';
      }

      if (this.refreshTimePercentage >= 50) {
        return 'success';
      }

      if (this.refreshTimePercentage < 50 && this.refreshTimePercentage >= 15) {
        return 'warning';
      }

      return 'error';
    },
    readableTimeUntilNextRefresh() {
      if (!this.timeUntilNextRefresh) {
        return '--:--';
      }

      return `(${this.$getMoment(this.timeUntilNextRefresh).format('mm:ss')})`;
    },
    focusedWindow() {
      return this.$electron.remote.BrowserWindow.getFocusedWindow();
    },
    watchingAmount() {
      if (!this.aniData) {
        return 0;
      }
      const object = this.findListByStatus('CURRENT');

      return object ? object.entries.length : 0;
    },
    completedAmount() {
      if (!this.aniData) {
        return 0;
      }
      const object = this.findListByStatus('COMPLETED');

      return object ? object.entries.length : 0;
    },
    pausedAmount() {
      if (!this.aniData) {
        return 0;
      }
      const object = this.findListByStatus('PAUSED');

      return object ? object.entries.length : 0;
    },
    droppedAmount() {
      if (!this.aniData) {
        return 0;
      }
      const object = this.findListByStatus('DROPPED');

      return object ? object.entries.length : 0;
    },
    planningAmount() {
      if (!this.aniData) {
        return 0;
      }
      const object = this.findListByStatus('PLANNING');

      return object ? object.entries.length : 0;
    },
  },
  data() {
    return { settingModalActive: false };
  },
  methods: {
    openInformationWindow(result) {
      this.openInformation(result.id);
    },
    findListByStatus(status) {
      const object = this.aniData.lists.find(item => item.status === status);

      return object === undefined ? null : object;
    },
    navigateTo(module) {
      let route = null;

      switch (module) {
        case this.modules.aniList:
          route = 'Ani-Watching';
          break;
        case this.modules.myAnimeList:
          route = 'MAL-Watching';
          break;
        case this.modules.torrents:
          route = 'Torrents-Main';
          break;
        default:
          break;
      }

      if (route) {
        this.$router.push(route);
      }
    },
  },
};
</script>

<style scoped>
.ui.menu {
  /* margin: 0; */
  position: sticky !important;
}

.menu.with.right.aligned.items > .item {
  text-align: right;
}

.icon.marginless {
  margin: 0 !important;
}

.relative.item {
  position: relative;
}

.refreshTimerBar {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  vertical-align: bottom;
  font-size: 1em;
}

.red.refreshTimerBar {
  background-color: rgba(208, 57, 54, 0.5)
}

.yellow.refreshTimerBar {
  background-color: rgba(253, 190, 65, 0.5);
}

.green.refreshTimerBar {
  background-color: rgba(53, 205, 76, 0.5);
}

.draggable {
  -webkit-app-region: drag;
}

.item:hover > .window.icon.minimize {
  color: #fdbd41;
}

.item:hover > .window.icon.maximize {
  color: #35cd4b;
}

.item:hover > .icon.close {
  color: #d03836;
}

.item, .icon {
  cursor: pointer;
}
</style>
