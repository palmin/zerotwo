<template>
  <div class="ui top fixed menu">
    <router-link class="item" tag="a" :to="{ name: 'Ani-Watching' }" active-class="active" exact>
      <i class="green stop icon"></i>
      {{ $t('system.menu.listStatus.watching') }} ({{ watchingAmount }})
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Completed' }" active-class="active" exact>
      <i class="blue stop icon"></i>
      {{ $t('system.menu.listStatus.completed') }} ({{ completedAmount }})
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Paused' }" active-class="active" exact>
      <i class="yellow stop icon"></i>
      {{ $t('system.menu.listStatus.onHold') }} ({{ pausedAmount }})
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Dropped' }" active-class="active" exact>
      <i class="red stop icon"></i>
      {{ $t('system.menu.listStatus.dropped') }} ({{ droppedAmount }})
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Planning' }" active-class="active" exact>
      <i class="black stop icon"></i>
      {{ $t('system.menu.listStatus.planned') }} ({{ planningAmount }})
    </router-link>
    <div class="right menu">
      <search-box @openInformation="openInformationWindow" />
      <a class="item" :class="{ disabled: !this.isAuthenticated }" @click="refreshAniList">
        <i class="refresh icon" :class="{ loading: !isReady }"></i>
        {{ readableTimeUntilNextRefresh }}
      </a>
      <a class="item" @click="openSettings">
        <i class="marginless settings icon"></i>
      </a>
      <div class="ui simple dropdown item">
        <i class="marginless sidebar icon"></i>
        <div class="menu with right aligned items">
          <router-link class="item" tag="a" :to="{ name: 'Ani-Watching' }" active-class="active" exact>
            {{ $t('system.modules.aniList') }}
          </router-link>
          <router-link class="disabled item" tag="a" :to="{ name: 'MAL-Watching' }" active-class="active" exact>
            {{ $t('system.modules.myAnimeList') }}
          </router-link>
          <router-link class="disabled item" tag="a" :to="{ name: 'Torrents-Main' }" active-class="active" exact>
            {{ $t('system.modules.torrents') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SearchBox from '../SearchBox';
import SettingModal from '../Settings';

export default {
  props: ['refreshAniList', 'openInformation', 'openSettings'],
  components: { SearchBox },
  computed: {
    ...mapState(['isReady']),
    ...mapState('aniList', ['timeUntilNextRefresh', 'aniData']),
    ...mapGetters('aniList', ['isAuthenticated']),
    readableTimeUntilNextRefresh() {
      if (!this.timeUntilNextRefresh) {
        return '';
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
    return {
      settingModalActive: false,
    };
  },
  methods: {
    openInformationWindow(result) {
      this.openInformation(result.id);
    },
    findListByStatus(status) {
      const object = this.aniData.lists.find(item => item.status === status);

      return object === undefined ? null : object;
    },
  },
};
</script>

<style scoped>
.ui.menu {
  /* margin: 0; */
  position: sticky;
}

.menu.with.right.aligned.items > .item {
  text-align: right;
}

.icon.marginless {
  margin: 0 !important;
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
