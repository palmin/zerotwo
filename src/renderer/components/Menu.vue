<template>
  <div class="ui top fixed menu">
    <div class="item">
      <strong>
        <i class="angle double right icon"></i>
        AniList
      </strong>
    </div>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Watching' }" active-class="active" exact>
      {{ getMALTabLabel('watching', 'user_watching') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Completed' }" active-class="active" exact>
      {{ getMALTabLabel('completed', 'user_completed') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Paused' }" active-class="active" exact>
      {{ getMALTabLabel('onHold', 'user_onhold') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Dropped' }" active-class="active" exact>
      {{ getMALTabLabel('dropped', 'user_dropped') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Ani-Planning' }" active-class="active" exact>
      {{ getMALTabLabel('planned', 'user_plantowatch') }}
    </router-link>
    <div class="right menu">
      <search-box @openInformation="openInformationWindow" />
      <a class="ui item" :class="{ disabled: !this.isAuthenticated }" @click="refreshAniList">
        <i class="refresh icon" :class="{ loading: !isReady }"></i>
        {{ $t('refreshAniList') }} {{ readableTimeUntilNextRefresh }}
      </a>
      <a class="ui item" @click="openSettings">
        <i class="settings icon"></i>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import SearchBox from './SearchBox';
import SettingModal from './Settings';

export default {
  props: ['refreshMAL', 'refreshAniList', 'openInformation', 'openSettings'],
  components: { SearchBox },
  computed: {
    ...mapState(['isReady']),
    // ...mapState('myAnimeList', ['timeUntilNextRefresh', 'auth', 'userData']),
    ...mapState('aniList', ['timeUntilNextRefresh']),
    ...mapGetters('aniList', ['isAuthenticated']),
    readableTimeUntilNextRefresh() {
      if (!this.timeUntilNextRefresh) {
        return '';
      }

      return `(${this.$getMoment(this.timeUntilNextRefresh).format('mm:ss')})`;
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
    getMALTabLabel(i18nKey, userDataKey) {
      if (!this.userData) {
        return this.$t(i18nKey);
      }

      return `${this.$t(i18nKey)} (${this.userData[userDataKey]})`;
    },
  },
};
</script>

<style scoped>
.ui.top.fixed.menu {
  position: sticky;
}

.draggable {
  -webkit-app-region: drag;
}
</style>

<i18n>
{
  "en": {
    "animeList": "MyAnimeList",
    "refreshMAL": "Refresh MAL",
    "refreshAniList": "Refresh AniList",
    "watching": "Watching",
    "completed": "Completed",
    "onHold": "On Hold",
    "dropped": "Dropped",
    "planned": "Planned",
    "notInList": "Not in your list",
    "searchAnime": "Search...",
    "settings": "Settings",
    "noResults": "No results could be found"
  },
  "de": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MAL aktualisieren",
    "refreshAniList": "AniList aktualisieren",
    "watching": "Laufend",
    "completed": "Beendet",
    "onHold": "Pausiert",
    "dropped": "Abgebrochen",
    "planned": "Geplant",
    "notInList": "Nicht in deiner Liste",
    "searchAnime": "Suchen ...",
    "settings": "Einstellungen",
    "noResults": "Es wurden keine Ergebnisse gefunden"
  },
  "ja": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MALを更新",
    "refreshAniList": "AniListを更新",
    "watching": "見る",
    "completed": "終了",
    "onHold": "中止",
    "dropped": "止めました",
    "planned": "見るつもり",
    "notInList": "リストにはありません",
    "searchAnime": "検索 ...",
    "settings": "環境設定",
    "noResults": "結果は見つかりませんでした。"
  }
}
</i18n>
