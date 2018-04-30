<template>
  <div class="ui top fixed menu">
    <router-link class="item" tag="a" :to="{ name: 'MAL-Watching' }" active-class="active" exact>
      {{ getMALTabLabel('watching', 'user_watching') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'MAL-Finished' }" active-class="active" exact>
      {{ getMALTabLabel('completed', 'user_completed') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'MAL-OnHold' }" active-class="active" exact>
      {{ getMALTabLabel('onHold', 'user_onhold') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'MAL-Dropped' }" active-class="active" exact>
      {{ getMALTabLabel('dropped', 'user_dropped') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'MAL-Planned' }" active-class="active" exact>
      {{ getMALTabLabel('planned', 'user_plantowatch') }}
    </router-link>
    <div class="right menu">
      <search-box @openInformation="openInformationWindow" />
      <a class="ui item" :class="{ disabled: !this.auth }" @click="refreshMAL">
        <i class="refresh icon" :class="{ loading: !isReady }"></i>
        {{ $t('refreshMAL') }} {{ readableTimeUntilNextRefresh }}
      </a>
      <a class="ui item" @click="openSettings">
        <i class="settings icon"></i>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchBox from './SearchBox';

export default {
  props: ['openSettings', 'refreshMAL', 'openInformation'],
  components: { SearchBox },
  computed: {
    ...mapState(['isReady']),
    ...mapState('myAnimeList', ['timeUntilNextRefresh', 'auth', 'userData']),
    readableTimeUntilNextRefresh() {
      if (!this.timeUntilNextRefresh) {
        return '';
      }

      return `(${this.$getMoment(this.timeUntilNextRefresh).format('mm:ss')})`;
    },
  },
  methods: {
    openInformationWindow(result) {
      this.openInformation(result.title);
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
</style>

<i18n>
{
  "en": {
    "animeList": "MyAnimeList",
    "refreshMAL": "Refresh MAL",
    "watching": "Watching",
    "completed": "Completed",
    "onHold": "On Hold",
    "dropped": "Dropped",
    "planned": "Planned",
    "notInList": "Not in your list",
    "searchAnime": "Search...",
    "noResults": "No results could be found"
  },
  "de": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MAL aktualisieren",
    "watching": "Laufend",
    "completed": "Beendet",
    "onHold": "Pausiert",
    "dropped": "Abgebrochen",
    "planned": "Geplant",
    "notInList": "Nicht in deiner Liste",
    "searchAnime": "Suchen ...",
    "noResults": "Es wurden keine Ergebnisse gefunden"
  },
  "ja": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MALを更新",
    "watching": "見る",
    "completed": "終了",
    "onHold": "中止",
    "dropped": "止めました",
    "planned": "見るつもり",
    "notInList": "リストにはありません",
    "searchAnime": "検索 ...",
    "noResults": "結果は見つかりませんでした。"
  }
}
</i18n>
